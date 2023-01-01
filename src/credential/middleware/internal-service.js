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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
function makeInternalServer() {
    return Object.freeze({
        authentication,
        getMasterUser,
        workflowRequest,
        workflowRequestUpload,
        getWorkflowRequest,
        checkWorkflowOn,
        checkDataWorkflow,
        checkDataPendingWorkflowUpload
        // sendLogRequest
    });
    function authentication(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                // const result = await consulService.lookupService({service: 'auth-service'})
                // console.log('res', result);
                // const response = await http.request({
                //     host: result[0].ServiceAddress,
                //     port: result[0].ServicePort,
                //     path: '/account/get',
                //     method: 'GET'
                // })
                // res.send(response)
                // const host = result[0].ServiceAddress
                // const port = result[0].ServicePort
                // const path = '/master/auth/me'
                // const url2 = 'https://'+host+':'+port+path
                const url = process.env.URL_HOST_MASTER + '/auth/me';
                const token = body.token;
                (0, axios_1.default)({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                })
                    .then(result => {
                    // console.log('data',result)
                    resolve(result.data);
                })
                    .catch(err => {
                    console.log('err', err);
                    // reject(new Error(err))
                    resolve(err.response.data);
                });
            });
        });
    }
    function getMasterUser(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let param;
                if (body.filter) {
                    if (body.orderby && body.ordertype) {
                        param = {
                            orderby: body.orderby,
                            ordertype: body.ordertype,
                            filter: body.filter
                        };
                    }
                    else {
                        param = {
                            orderby: 'id',
                            ordertype: 'asc',
                            filter: body.filter
                        };
                    }
                    if (body.perpage && body.page) {
                        param.page = body.page;
                        param.perpage = body.perpage;
                    }
                    else {
                        param.page = 1;
                        param.perpage = 1000;
                    }
                }
                else {
                    if (body.orderby && body.ordertype) {
                        param = {
                            orderby: body.orderby,
                            ordertype: body.ordertype
                        };
                    }
                    else {
                        param = {
                            orderby: 'id',
                            ordertype: 'asc'
                        };
                    }
                    if (body.perpage && body.page) {
                        param.page = body.page;
                        param.perpage = body.perpage;
                    }
                    else {
                        param.page = 1;
                        param.perpage = 1000;
                    }
                }
                const url = process.env.URL_HOST_MASTER + '/internal/user';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: param,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err)
                    resolve(err.response.data);
                });
            });
        });
    }
    function workflowRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                const url = process.env.URL_HOST_WORKFLOW + '/internal/request';
                (0, axios_1.default)({
                    method: 'POST',
                    url: url,
                    data: Object.assign({}, body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    console.log('masuk');
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err.response.data)
                    resolve(err.response.data);
                });
            });
        });
    }
    function workflowRequestUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                const url = process.env.URL_HOST_WORKFLOW + '/internal/request/upload';
                (0, axios_1.default)({
                    method: 'POST',
                    url: url,
                    data: Object.assign({}, body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    console.log('berhasil');
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err.response.data)
                    resolve(err.response.data);
                });
            });
        });
    }
    function getWorkflowRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                const url = process.env.URL_HOST_WORKFLOW + '/internal/request';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        menuId: body.menuId,
                        backendUrl: body.backendUrl
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err.response.data)
                    resolve(err.response.data);
                });
            });
        });
    }
    function checkWorkflowOn(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                const url = process.env.URL_HOST_WORKFLOW + '/internal/check/setting';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        menuId: body.menuId,
                        beUrl: body.backendUrl,
                        method: body.method
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    // console.log('res', result.data);
                    let res;
                    if (result.data.data == null || result.data.data == '') {
                        res = false;
                    }
                    else {
                        res = true;
                    }
                    resolve(res);
                })
                    .catch(err => {
                    // console.log('err',err.response.data)
                    resolve(err.response.data);
                });
            });
        });
    }
    function checkDataWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                const url = process.env.URL_HOST_WORKFLOW + '/internal/check/data';
                let method;
                if (!body.method) {
                    method = 'NULL';
                }
                else {
                    method = body.method;
                }
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        menuId: body.menuId,
                        backendUrl: body.backendUrl,
                        method: method
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    // console.log('res', result.data);
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err.response.data)
                    resolve(err.response.data);
                });
            });
        });
    }
    function checkDataPendingWorkflowUpload(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                const url = process.env.URL_HOST_WORKFLOW + '/internal/check/data/pending/upload';
                (0, axios_1.default)({
                    method: 'GET',
                    url: url,
                    params: {
                        menuId: body.menuId
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(result => {
                    // console.log('res', result.data);
                    resolve(result.data);
                })
                    .catch(err => {
                    // console.log('err',err.response.data)
                    resolve(err.response.data);
                });
            });
        });
    }
    // async function sendLogRequest(body){
    //   return new Promise(function(resolve, reject) {
    //     // console.log('log service');
    //     const url = process.env.URL_HOST_LOG+'/activity/detail'
    //     // const url = 'https://api-dev.adapro.tech/log/activity/detail'
    //     axios ({
    //       method: 'PUT',
    //       url: url,
    //       data: {
    //         ...body
    //       },
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     })
    //     .then(result =>{
    //       // console.log('masuk log service');
    //       resolve(result.data)
    //     })
    //     .catch(err =>{
    //       // console.log('err log service',err.response.data)
    //       resolve(err.response.data)
    //     })
    //   })
    // }
}
exports.default = makeInternalServer;
