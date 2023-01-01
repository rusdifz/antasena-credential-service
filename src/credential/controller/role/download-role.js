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
function makeDownloadRole({ downloadDataRole, internalServer, redisClient }) {
    return function downloadRole(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bodyparam = httpRequest.query;
                const token = { token: httpRequest.token };
                const authMe = yield internalServer.authentication(token);
                let posted;
                if (authMe.status == false) {
                    posted = {
                        status: false,
                        responseCode: 401,
                        data: 'User Unauthorized'
                    };
                    return {
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Last-Modified': new Date(posted.createdTime).toUTCString()
                        },
                        statusCode: 200,
                        body: posted
                    };
                }
                else {
                    bodyparam.usernameToken = authMe.data.username;
                    posted = yield downloadDataRole(bodyparam);
                    const entityLog = {
                        username: authMe.data.username,
                        moduleId: bodyparam.moduleId,
                        menuId: '005',
                        screenId: 'Master Role',
                        actionType: 'Download',
                        actionDetail: 'Download Data Master Role',
                        actionBeUrl: '/credential/role/download',
                        actionBeMethod: 'GET'
                    };
                    if (posted.status == true) {
                        entityLog.actionStatus = 'success';
                    }
                    else {
                        entityLog.actionStatus = 'failed';
                    }
                    redisClient.publish(entityLog);
                    if (posted.status == true) {
                        return {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            statusCode: 200,
                            body: {
                                responseCode: 200,
                                nameFile: posted.data
                            },
                            downloadfile: 'yes'
                        };
                    }
                    else {
                        return {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            statusCode: posted.responseCode,
                            body: posted
                        };
                    }
                }
            }
            catch (err) {
                // TODO: Error logging
                console.log(err);
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 500,
                    body: {
                        status: false,
                        responseCode: 500,
                        message: err.message
                    }
                };
            }
        });
    };
}
exports.default = makeDownloadRole;
