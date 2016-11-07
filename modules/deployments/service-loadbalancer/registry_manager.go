/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing,
 *   software distributed under the License is distributed on an
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *   KIND, either express or implied.  See the License for the
 *   specific language governing permissions and limitations
 *   under the License.
 */
package main

import (
	"net/http"
	"crypto/tls"
	"os"
	"github.com/golang/glog"
	"bytes"
	"io/ioutil"
)

const (
	registryPath = "customurl/"
	cloudType = "app-cloud/"
	securityCertificates = "/securityCertificates/"
	maxRetryCount = 3
	pemFileExtension = ".pem"
	keyFileExtension = ".key"
	pubFileExtension = ".pub"
	authorizationHeader = "Authorization"
	authorizationHeaderValue = "Basic YWRtaW46YWRtaW4="
	hypenSeparator = "-"
	getHTTPMethod = "GET"
	forwardSlashSeparator = "/"
)

func getResource(resource string, retryCount int) *http.Response {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	request, _ := http.NewRequest(getHTTPMethod, resource, nil)
	request.Header.Set(authorizationHeader, authorizationHeaderValue)
	response, err := client.Do(request)
	if err != nil {
		glog.Info("ERROR: ")
		glog.Errorln(err)
	} else {
		if response.StatusCode != 200 && retryCount < maxRetryCount {
			retryCount++
			response = getResource(resource, retryCount)
			if retryCount == maxRetryCount {
				glog.Infof("INFO: Unable to get resource " + resource)
				return nil
			}
		}
	}
	return response
}

func getResourceContent(resourcePath string, fileName string, retryCount int) string {
	response := getResource(resourcePath + fileName, retryCount)
	if response != nil {
		defer response.Body.Close()
		byteResponse, err := ioutil.ReadAll(response.Body);
		stringResponse := string(byteResponse)
		if err != nil {
			glog.Info("ERROR: ")
			glog.Errorln(err)
		} else {
			return stringResponse
		}
	}
	return ""
}

func createFile(content string, fileName string) {
	out, err := os.Create(fileName)
	if err != nil {
		glog.Errorln(err)
	} else {
		out.WriteString(content)
		out.Sync()
	}
}

func createSSLPemFile(certString string, keyString string, chainString string, filePath string) {
	var buffer bytes.Buffer
	if keyString != "" && certString != "" && chainString != "" {
		buffer.WriteString(keyString)
		buffer.WriteString(certString)
		buffer.WriteString(chainString)
	}

	createFile(buffer.String(), filePath);
}

func addSecurityCertificate(resourcePath string, appName string, certificatesDir string) {
	certFile := *appTenantDomain + hypenSeparator + appName + pemFileExtension
	keyFile := *appTenantDomain + hypenSeparator + appName + keyFileExtension
	chainFile := *appTenantDomain + hypenSeparator + appName + pubFileExtension

	retryCount := 0
	certString := getResourceContent(resourcePath, certFile, retryCount)
	keyString := getResourceContent(resourcePath, keyFile, retryCount)
	chainString := getResourceContent(resourcePath, chainFile, retryCount)

	if certString != "" && keyString != "" && chainString != "" {
		filePath := certificatesDir + *appTenantDomain + hypenSeparator + appName + pemFileExtension
		createSSLPemFile(certString, keyString, chainString, filePath)
	}
}