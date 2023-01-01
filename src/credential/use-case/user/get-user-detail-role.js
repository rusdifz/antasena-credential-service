"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function makeGetUserDetailRole({ userDb, internalServer, moment }) {
    return function getUserDetailRole(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('body', body);
                const getUser = yield internalServer.getMasterUser(body);
                let user;
                let info = 'empty';
                let result;
                if (getUser.responseCode == 200) {
                    yield getUser.data.users.map(data => {
                        console.log('data', data);
                        let updatedTime;
                        if (data.updatedTime == null || data.updatedTime == '') {
                            updatedTime = null;
                        }
                        else {
                            updatedTime = moment(data.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        }
                        if (data.username == body.username) {
                            info = 'exist';
                            user = {
                                id: data.id,
                                username: data.username,
                                email: data.email,
                                fullname: data.fullname,
                                createdTime: moment(data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                createdUser: data.createdUser,
                                updatedTime: updatedTime,
                                updatedUser: data.updatedUser || null
                            };
                        }
                    });
                    if (info == 'exist') {
                        const getUserAccess = yield userDb.getDataUserAccess(body);
                        const roleSelection = yield userDb.getDataUserRoleSelection(body);
                        const roleSelected = yield userDb.getDataUserRoleSelected(body);
                        if (getUserAccess.status == true && roleSelection.status == true && roleSelected.status == true) {
                            result = {
                                status: true,
                                responseCode: 200,
                                data: {
                                    user: user,
                                    access: getUserAccess.data,
                                    roles: {
                                        selection: roleSelection.data,
                                        selected: roleSelected.data
                                    }
                                }
                            };
                        }
                        else {
                            let data;
                            if (getUserAccess.status == false) {
                                data = getUserAccess.data;
                            }
                            else if (roleSelection.status == false) {
                                data = roleSelection.data;
                            }
                            else {
                                data = roleSelected.data;
                            }
                            result = {
                                status: false,
                                responseCode: 500,
                                data: data
                            };
                        }
                    }
                    else {
                        result = {
                            status: true,
                            responseCode: 200,
                            data: {
                                user: {},
                                access: {},
                                roles: {
                                    selection: [],
                                    selected: []
                                }
                            }
                        };
                    }
                }
                else {
                    result = {
                        status: false,
                        responseCode: getUser.responseCode,
                        data: getUser.errorMessage
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-makeGetUserDetailRoles ' + error);
            }
        });
    };
}
exports.default = makeGetUserDetailRole;
