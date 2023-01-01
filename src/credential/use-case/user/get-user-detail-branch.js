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
function makeGetUserDetailBranch({ userDb, internalServer, moment }) {
    return function getUserDetailBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('use case', body);
                const getUser = yield internalServer.getMasterUser(body);
                let user;
                let info = 'empty';
                let result;
                if (getUser.responseCode == 200) {
                    yield getUser.data.users.map(data => {
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
                                id: data.id || '',
                                username: data.username,
                                email: data.email,
                                fullname: data.fullname,
                                createdTime: moment(data.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                createdUser: data.createdUser,
                                updatedTime: updatedTime,
                                updatedUser: data.updatedUser
                            };
                        }
                    });
                    if (info == 'exist') {
                        const branchSelection = yield userDb.getDataUserBranchSelection(body);
                        const branchSelected = yield userDb.getDataUserBranchSelected(body);
                        result = {
                            status: true,
                            responseCode: 200,
                            data: {
                                user: user,
                                branches: {
                                    selection: branchSelection.data,
                                    selected: branchSelected.data
                                }
                            }
                        };
                    }
                    else {
                        result = {
                            status: true,
                            responseCode: 200,
                            data: {
                                user: {},
                                branches: {
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
                throw new Error('usecase-makeGetUserDetailBranch' + error);
            }
        });
    };
}
exports.default = makeGetUserDetailBranch;
