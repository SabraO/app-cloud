/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var user = {};

(function (user) {

    var CarbonConstants = Packages.org.wso2.carbon.CarbonConstants;

    user.systemUser = CarbonConstants.REGISTRY_SYSTEM_USERNAME;

    user.anonUser = CarbonConstants.REGISTRY_ANONNYMOUS_USERNAME;

    user.anonRole = CarbonConstants.REGISTRY_ANONNYMOUS_ROLE_NAME;

    var User = function (manager, username) {
        this.um = manager;
        this.username = username;
    };
    user.User = User;

    User.prototype.getClaims = function (profile) {
        return this.um.manager.getClaims(this.username, profile);
    };

    User.prototype.setClaims = function (claims, profile) {
        this.um.manager.setUserClaimValues(this.username, claims, profile);
    };

    User.prototype.getRoles = function () {
        return this.um.manager.getRoleListOfUser(this.username);
    };

    User.prototype.hasRoles = function (roles) {
        var i, j, role,
            rs = this.getRoles(),
            length1 = roles.length,
            length2 = rs.length;
        L1:
            for (i = 0; i < length1; i++) {
                //Array.indexOf() fails due to Java String vs JS String difference
                role = roles[i];
                for (j = 0; j < length2; j++) {
                    if (role == rs[j]) {
                        continue L1;
                    }
                }
                return false;
            }
        return true;
    };

    User.prototype.addRoles = function (roles) {
        return this.um.manager.updateRoleListOfUser(this.username, [], roles);
    };

    User.prototype.removeRoles = function (roles) {
        return this.um.manager.updateRoleListOfUser(this.username, roles, []);
    };

    User.prototype.updateRoles = function (remove, add) {
        return this.um.manager.updateRoleListOfUser(this.username, remove, add);
    };

    User.prototype.isAuthorized = function (permission, action) {
        var i,
            roles = this.getRoles(),
            length = roles.length;
        for (i = 0; i < length; i++) {
            if (this.um.authorizer.isRoleAuthorized(roles[i], permission, action)) {
                return true;
            }
        }
        return false;
    };

}(user));