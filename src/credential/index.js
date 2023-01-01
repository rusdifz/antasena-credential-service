"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import express from 'express';
const express = require('express');
const body_parser_1 = __importDefault(require("body-parser"));
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const helpers_1 = require("./helpers");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = express();
const makeCallback = require('./call-back');
const controller_1 = require("./controller");
app.use(body_parser_1.default.json({ limit: '100000kb' }));
app.use((0, cors_1.default)());
//endpoint internal
app.put('/internal/branch/detail', makeCallback(controller_1.internalCreateBranchDetail, camelcase_keys_1.default));
app.delete('/internal/branch/detail', makeCallback(controller_1.internalDeleteBranchDetail, camelcase_keys_1.default));
app.post('/internal/branch/detail', makeCallback(controller_1.internalUpdateBranchDetail, camelcase_keys_1.default));
app.get('/internal/branch', makeCallback(controller_1.internalGetBranch, camelcase_keys_1.default));
app.put('/internal/role/detail', makeCallback(controller_1.internalCreateRoleDetail, camelcase_keys_1.default));
app.delete('/internal/role/detail', makeCallback(controller_1.internalDeleteRoleDetail, camelcase_keys_1.default));
app.post('/internal/role/detail', makeCallback(controller_1.internalUpdateRoleDetail, camelcase_keys_1.default));
app.post('/internal/role/mapping', makeCallback(controller_1.internalupdateRoleMapping, camelcase_keys_1.default));
app.get('/internal/role', makeCallback(controller_1.internalGetRole, camelcase_keys_1.default));
app.post('/internal/user/detail/role', makeCallback(controller_1.internalUpdateUserDetailRole, camelcase_keys_1.default));
app.post('/internal/user/detail/branch', makeCallback(controller_1.internalUpdateUserDetailBranch, camelcase_keys_1.default));
app.post('/internal/branch/upload', makeCallback(controller_1.internalUploadBranch, camelcase_keys_1.default));
// endpoint about user data (OK)
app.post('/user/detail/role', makeCallback(controller_1.updateUserDetailRole, camelcase_keys_1.default));
app.post('/user/detail/branch', makeCallback(controller_1.updateUserDetailBranch, camelcase_keys_1.default));
app.get('/user', makeCallback(controller_1.getUser, camelcase_keys_1.default));
app.get('/user/detail/role', makeCallback(controller_1.getUserDetailRole, camelcase_keys_1.default));
app.get('/user/detail/branch', makeCallback(controller_1.getUserDetailBranch, camelcase_keys_1.default));
// app.get('/user/detail/branch/download', makeCallback(downloadUserDetailBranch,camelcaseKeys))
// app.get('/user/detail/role/download', makeCallback(downloadUserDetailRole,camelcaseKeys))
//endpoint role user data (OK)
app.post('/role/detail', makeCallback(controller_1.updateRoleDetail, camelcase_keys_1.default));
app.post('/role/detail/validate', makeCallback(controller_1.validasiRoleInput, camelcase_keys_1.default));
app.post('/role/mapping', makeCallback(controller_1.updateRoleMapping, camelcase_keys_1.default));
app.get('/role', makeCallback(controller_1.getRole, camelcase_keys_1.default));
app.get('/role/detail', makeCallback(controller_1.getRoleDetail, camelcase_keys_1.default));
app.put('/role/detail', makeCallback(controller_1.createRoleDetail, camelcase_keys_1.default));
app.put('/role/detail/validate', makeCallback(controller_1.validasiRoleInput, camelcase_keys_1.default));
app.delete('/role/detail', makeCallback(controller_1.deleteRoleDetail, camelcase_keys_1.default));
app.delete('/role/detail/validate', makeCallback(controller_1.validasiRoleDelete, camelcase_keys_1.default));
app.get('/role/download', makeCallback(controller_1.downloadRole, camelcase_keys_1.default));
//endpoint branch data (OK)
app.post('/branch/detail', makeCallback(controller_1.updateBranchDetail, camelcase_keys_1.default));
app.post('/branch/detail/validate', makeCallback(controller_1.validasiBranchInput, camelcase_keys_1.default));
app.get('/branch', makeCallback(controller_1.getBranch, camelcase_keys_1.default));
app.get('/branch/detail', makeCallback(controller_1.getBranchDetail, camelcase_keys_1.default));
app.put('/branch/detail', makeCallback(controller_1.createBranchDetail, camelcase_keys_1.default));
app.put('/branch/detail/validate', makeCallback(controller_1.validasiBranchInput, camelcase_keys_1.default));
app.delete('/branch/detail', makeCallback(controller_1.deleteBranchDetail, camelcase_keys_1.default));
app.delete('/branch/detail/validate', makeCallback(controller_1.validasiBranchDelete, camelcase_keys_1.default));
app.get('/branch/download', makeCallback(controller_1.downloadBranch, camelcase_keys_1.default));
app.get('/branch/download/workflow/:code', makeCallback(controller_1.internalDownloadBranch, camelcase_keys_1.default));
app.post('/branch/upload', makeCallback(controller_1.uploadBranch, camelcase_keys_1.default));
app.post('/branch/upload/workflow', makeCallback(controller_1.internalUploadBranchReqWorkflow, camelcase_keys_1.default));
//endpoint check server
app.get('/server_check', function (req, res) {
    res.send({
        statusCode: 200,
        body: {
            response_code: 200,
            data: 'credential service good'
        }
    });
});
app.use((err, req, res, next) => {
    (0, helpers_1.handleError)(err, res);
});
exports.default = app;
