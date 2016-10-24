/*
 *
 *   Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */

// page initialization
$(document).ready(function () {
    getExposureLevel();
});

$("#update-default-version").click(function () {
    var versionName = $("#default-version option:selected").val();

    jagg.post("../blocks/settings/settings.jag", {
        action: "updateDefaultVersion",
        applicationName: applicationName,
        defaultVersion: versionName
    },function defaultVersionUpdatedSuccess(result) {
        //alert(result);
        var defaultVersion = "Default version is set to " + $("#default-version option:selected").val();
        $("#lbl-default-version").text(defaultVersion);
        jagg.message({content: "Default version is successfully updated.", type: 'success', id: 'view_log'});
        setTimeout(redirectAppHome, 3000);
        function redirectAppHome(){
            window.location.replace("home.jag?applicationKey=" + result);
        }
    },function (jqXHR, textStatus, errorThrown) {
        jagg.message({content: jqXHR.responseText, type: 'error', id: 'view_log'});

    });
});


$("#update-exposure-level").click(function () {
    var versionName = $("#exposure-level-version-list option:selected").val();

    jagg.post("../blocks/application/application.jag", {
        action: "updateVersionExposureLevel",
        applicationName: applicationName,
        versionName: versionName,
        exposureLevel: $("input:radio[name='security-radio']:checked").val()
    },function exposureLevelUpdatedSuccess(result) {
        jagg.message({content: "Exposure level is successfully updated.", type: 'success', id: 'view_log'});

    },function (jqXHR, textStatus, errorThrown) {
        jagg.message({content: jqXHR.responseText, type: 'error', id: 'view_log'});

    });
});

$("#exposure-level-version-list").change(function () {
    getExposureLevel();
});

function getExposureLevel() {
    var versionName = $("#exposure-level-version-list option:selected").val();
    jagg.post("../blocks/application/application.jag", {
        action:"getExposureLevel",
        versionName:versionName,
        applicationName:applicationName
    },function (result) {
        $("#security-" + result).prop("checked", true);
    },function (jqXHR, textStatus, errorThrown) {
        jagg.message({content: "Error occurred while retrieving the endpoint security level of the selected "
                    + cloudSpecificApplicationRepresentation.toLowerCase() + " version", type: 'error', id:'view_log'});
    });
}