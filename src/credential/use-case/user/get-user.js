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
function makeGetUser({ userDb, internalServer, moment }) {
    return function getUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield internalServer.getMasterUser(body);
                console.log('getuser', getUser);
                if (getUser.data.users == null) {
                    console.log('null');
                }
                else {
                    console.log('not nilll');
                }
                let result;
                const getDataWorkflow = yield internalServer.getWorkflowRequest({ menuId: '003, 004', backendUrl: '/credential/user' });
                const dataWorkflow = getDataWorkflow.data.menuData;
                console.log('data', dataWorkflow);
                if (getUser.responseCode == 200) {
                    if (getUser.data.users != null) {
                        let data = yield Promise.all(getUser.data.users.map((dataUser) => __awaiter(this, void 0, void 0, function* () {
                            let updatedTime;
                            if (dataUser.updatedTime == null || dataUser.updatedTime == '') {
                                updatedTime = null;
                            }
                            else {
                                updatedTime = moment(dataUser.updatedTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                            }
                            let pending;
                            function dataPending(workflow) {
                                console.log('workflow', workflow.user);
                                return workflow.user.id === dataUser.id;
                            }
                            const find = dataWorkflow.find(dataPending);
                            if (find != undefined) {
                                console.log('id', find.id);
                                pending = 'yes';
                            }
                            else {
                                pending = 'no';
                            }
                            const user = {
                                id: dataUser.id,
                                username: dataUser.username,
                                nik: dataUser.nik,
                                email: dataUser.email,
                                fullName: dataUser.fullname,
                                department: dataUser.department,
                                division: dataUser.division,
                                expiredDate: dataUser.expiredDate,
                                status: dataUser.status,
                                //roles: role.data, 
                                branch: dataUser.branch,
                                pending: pending,
                                createdTime: moment(dataUser.createdTime).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                                createdUser: dataUser.createdUser,
                                updatedTime: updatedTime,
                                updatedUser: dataUser.updatedUser
                            };
                            return user;
                        })));
                        const filterData = yield userDb.getDataFilterUser();
                        if (filterData.status == true) {
                            result = {
                                status: true,
                                responseCode: 200,
                                data: data,
                                info: getUser.data.info,
                                filter: filterData.data
                            };
                        }
                        else {
                            result = {
                                status: false,
                                responseCode: 500,
                                data: filterData.data
                            };
                        }
                    }
                    else {
                        const filterData = yield userDb.getDataFilterUser();
                        if (filterData.status == true) {
                            result = {
                                status: true,
                                responseCode: 200,
                                data: [],
                                info: getUser.data.info,
                                filter: filterData.data
                            };
                        }
                        else {
                            result = {
                                status: false,
                                responseCode: 500,
                                data: filterData.data
                            };
                        }
                    }
                }
                else {
                    result = {
                        status: false,
                        responseCode: 400,
                        data: getUser.errorMessage,
                        info: {
                            allrec: 0,
                            sentrec: 0
                        },
                        filter: []
                    };
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-getUser' + error);
            }
        });
    };
}
exports.default = makeGetUser;
