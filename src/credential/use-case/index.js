"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalUploadDataBranchReqWorkflow = exports.internalUploadDataBranch = exports.internalUpdateDataUserDetailBranch = exports.internalUpdateDataUserDetailRole = exports.internalGetDataRole = exports.internalDeleteDataRoleDetail = exports.internalUpdateDataRoleMapping = exports.internalUpdateDataRoleDetail = exports.internalCreateDataRoleDetail = exports.internalGetDataBranch = exports.internalDeleteDataBranchDetail = exports.internalUpdateDataBranchDetail = exports.internalCreateDataBranchDetail = exports.validasiDataBranchDelete = exports.validasiDataBranchInput = exports.downloadDataBranch = exports.uploadDataBranch = exports.deleteDataBranchDetail = exports.getDataBranchDetail = exports.getDataBranch = exports.updateDataBranchDetail = exports.createDataBranchDetail = exports.validasiDataRoleDelete = exports.validasiDataRoleInput = exports.downloadDataRole = exports.deleteDataRoleDetail = exports.updateDataRoleMapping = exports.updateDataRoleDetail = exports.getDataRoleDetail = exports.getDataRole = exports.createDataRoleDetail = exports.downloadDataUserDetailRole = exports.downloadDataUserDetailBranch = exports.updateDataUserDetailBranch = exports.updateDataUserDetailRole = exports.getDataUserDetailBranch = exports.getDataUserDetailRole = exports.getDataUser = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
moment_timezone_1.default.locale('id');
const exceljs_1 = __importDefault(require("exceljs"));
const data_access_1 = require("../data-access");
const middleware_1 = require("../middleware");
const user_1 = __importDefault(require("../entity/user"));
const role_1 = __importDefault(require("../entity/role"));
const branch_1 = __importDefault(require("../entity/branch"));
const notification_1 = __importDefault(require("../entity/notification"));
const get_user_1 = __importDefault(require("./user/get-user"));
const get_user_detail_role_1 = __importDefault(require("./user/get-user-detail-role"));
const get_user_detail_branch_1 = __importDefault(require("./user/get-user-detail-branch"));
const update_user_detail_role_1 = __importDefault(require("./user/update-user-detail-role"));
const update_user_detail_branch_1 = __importDefault(require("./user/update-user-detail-branch"));
const download_user_detail_branch_1 = __importDefault(require("./user/download-user-detail-branch"));
const download_user_detail_role_1 = __importDefault(require("./user/download-user-detail-role"));
const create_role_detail_1 = __importDefault(require("./role/create-role-detail"));
const get_role_1 = __importDefault(require("./role/get-role"));
const get_role_detail_1 = __importDefault(require("./role/get-role-detail"));
const update_role_detail_1 = __importDefault(require("./role/update-role-detail"));
const update_role_mapping_1 = __importDefault(require("./role/update-role-mapping"));
const delete_role_detail_1 = __importDefault(require("./role/delete-role-detail"));
const download_data_role_1 = __importDefault(require("./role/download-data-role"));
const validasi_role_input_1 = __importDefault(require("./role/validasi-role-input"));
const validasi_role_delete_1 = __importDefault(require("./role/validasi-role-delete"));
const create_branch_detail_1 = __importDefault(require("./branch/create-branch-detail"));
const get_branch_1 = __importDefault(require("./branch/get-branch"));
const get_branch_detail_1 = __importDefault(require("./branch/get-branch-detail"));
const update_branch_detail_1 = __importDefault(require("./branch/update-branch-detail"));
const delete_branch_detail_1 = __importDefault(require("./branch/delete-branch-detail"));
const upload_branch_1 = __importDefault(require("./branch/upload-branch"));
const download_branch_1 = __importDefault(require("./branch/download-branch"));
const validasi_branch_input_1 = __importDefault(require("./branch/validasi-branch-input"));
const validasi_branch_delete_1 = __importDefault(require("./branch/validasi-branch-delete"));
const create_branch_detail_2 = __importDefault(require("./internal/branch/create-branch-detail"));
const update_branch_detail_2 = __importDefault(require("./internal/branch/update-branch-detail"));
const delete_branch_detail_2 = __importDefault(require("./internal/branch/delete-branch-detail"));
const get_branch_2 = __importDefault(require("./internal/branch/get-branch"));
const create_role_detail_2 = __importDefault(require("./internal/role/create-role-detail"));
const update_role_detail_2 = __importDefault(require("./internal/role/update-role-detail"));
const update_role_mapping_2 = __importDefault(require("./internal/role/update-role-mapping"));
const delete_role_detail_2 = __importDefault(require("./internal/role/delete-role-detail"));
const get_role_2 = __importDefault(require("./internal/role/get-role"));
const update_user_detail_branch_2 = __importDefault(require("./internal/user/update-user-detail-branch"));
const update_user_detail_role_2 = __importDefault(require("./internal/user/update-user-detail-role"));
const upload_branch_2 = __importDefault(require("./internal/branch/upload-branch"));
const upload_branch_req_workflow_1 = __importDefault(require("./internal/branch/upload-branch-req-workflow"));
const getDataUser = (0, get_user_1.default)({ userDb: data_access_1.userDb, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default });
exports.getDataUser = getDataUser;
const getDataUserDetailRole = (0, get_user_detail_role_1.default)({ userDb: data_access_1.userDb, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default });
exports.getDataUserDetailRole = getDataUserDetailRole;
const getDataUserDetailBranch = (0, get_user_detail_branch_1.default)({ userDb: data_access_1.userDb, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default });
exports.getDataUserDetailBranch = getDataUserDetailBranch;
const updateDataUserDetailRole = (0, update_user_detail_role_1.default)({ userDb: data_access_1.userDb, makeUser: user_1.default, makeRole: role_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.updateDataUserDetailRole = updateDataUserDetailRole;
const updateDataUserDetailBranch = (0, update_user_detail_branch_1.default)({ userDb: data_access_1.userDb, makeBranch: branch_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.updateDataUserDetailBranch = updateDataUserDetailBranch;
const downloadDataUserDetailBranch = (0, download_user_detail_branch_1.default)({ internalServer: middleware_1.internalServer, ExcelJs: exceljs_1.default, moment: moment_timezone_1.default });
exports.downloadDataUserDetailBranch = downloadDataUserDetailBranch;
const downloadDataUserDetailRole = (0, download_user_detail_role_1.default)({ userDb: data_access_1.userDb, internalServer: middleware_1.internalServer, ExcelJs: exceljs_1.default, moment: moment_timezone_1.default });
exports.downloadDataUserDetailRole = downloadDataUserDetailRole;
const createDataRoleDetail = (0, create_role_detail_1.default)({ roleDb: data_access_1.roleDb, userDb: data_access_1.userDb, makeRole: role_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.createDataRoleDetail = createDataRoleDetail;
const getDataRole = (0, get_role_1.default)({ roleDb: data_access_1.roleDb, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.getDataRole = getDataRole;
const getDataRoleDetail = (0, get_role_detail_1.default)({ roleDb: data_access_1.roleDb, moment: moment_timezone_1.default });
exports.getDataRoleDetail = getDataRoleDetail;
const updateDataRoleDetail = (0, update_role_detail_1.default)({ roleDb: data_access_1.roleDb, userDb: data_access_1.userDb, makeRole: role_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.updateDataRoleDetail = updateDataRoleDetail;
const updateDataRoleMapping = (0, update_role_mapping_1.default)({ roleDb: data_access_1.roleDb, userDb: data_access_1.userDb, makeRole: role_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default });
exports.updateDataRoleMapping = updateDataRoleMapping;
const deleteDataRoleDetail = (0, delete_role_detail_1.default)({ roleDb: data_access_1.roleDb, userDb: data_access_1.userDb, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.deleteDataRoleDetail = deleteDataRoleDetail;
const downloadDataRole = (0, download_data_role_1.default)({ roleDb: data_access_1.roleDb, ExcelJs: exceljs_1.default, moment: moment_timezone_1.default });
exports.downloadDataRole = downloadDataRole;
const validasiDataRoleInput = (0, validasi_role_input_1.default)({ roleDb: data_access_1.roleDb, makeRole: role_1.default });
exports.validasiDataRoleInput = validasiDataRoleInput;
const validasiDataRoleDelete = (0, validasi_role_delete_1.default)({ roleDb: data_access_1.roleDb });
exports.validasiDataRoleDelete = validasiDataRoleDelete;
const createDataBranchDetail = (0, create_branch_detail_1.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeBranch: branch_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.createDataBranchDetail = createDataBranchDetail;
const getDataBranch = (0, get_branch_1.default)({ branchDb: data_access_1.branchDb, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.getDataBranch = getDataBranch;
const getDataBranchDetail = (0, get_branch_detail_1.default)({ branchDb: data_access_1.branchDb, moment: moment_timezone_1.default });
exports.getDataBranchDetail = getDataBranchDetail;
const updateDataBranchDetail = (0, update_branch_detail_1.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeBranch: branch_1.default, makeNotification: notification_1.default, internalServer: middleware_1.internalServer, moment: moment_timezone_1.default });
exports.updateDataBranchDetail = updateDataBranchDetail;
const deleteDataBranchDetail = (0, delete_branch_detail_1.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeNotification: notification_1.default, internalServer: middleware_1.internalServer });
exports.deleteDataBranchDetail = deleteDataBranchDetail;
const uploadDataBranch = (0, upload_branch_1.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, ExcelJs: exceljs_1.default, makeBranch: branch_1.default, makeNotification: notification_1.default, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.uploadDataBranch = uploadDataBranch;
const downloadDataBranch = (0, download_branch_1.default)({ branchDb: data_access_1.branchDb, ExcelJs: exceljs_1.default, moment: moment_timezone_1.default });
exports.downloadDataBranch = downloadDataBranch;
const validasiDataBranchInput = (0, validasi_branch_input_1.default)({ branchDb: data_access_1.branchDb, makeBranch: branch_1.default });
exports.validasiDataBranchInput = validasiDataBranchInput;
const validasiDataBranchDelete = (0, validasi_branch_delete_1.default)({ branchDb: data_access_1.branchDb });
exports.validasiDataBranchDelete = validasiDataBranchDelete;
const internalCreateDataBranchDetail = (0, create_branch_detail_2.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeBranch: branch_1.default, makeNotification: notification_1.default });
exports.internalCreateDataBranchDetail = internalCreateDataBranchDetail;
const internalUpdateDataBranchDetail = (0, update_branch_detail_2.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeBranch: branch_1.default, makeNotification: notification_1.default });
exports.internalUpdateDataBranchDetail = internalUpdateDataBranchDetail;
const internalDeleteDataBranchDetail = (0, delete_branch_detail_2.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeNotification: notification_1.default });
exports.internalDeleteDataBranchDetail = internalDeleteDataBranchDetail;
const internalGetDataBranch = (0, get_branch_2.default)({ branchDb: data_access_1.branchDb, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.internalGetDataBranch = internalGetDataBranch;
const internalCreateDataRoleDetail = (0, create_role_detail_2.default)({ roleDb: data_access_1.roleDb, makeRole: role_1.default, userDb: data_access_1.userDb, makeNotification: notification_1.default });
exports.internalCreateDataRoleDetail = internalCreateDataRoleDetail;
const internalUpdateDataRoleDetail = (0, update_role_detail_2.default)({ roleDb: data_access_1.roleDb, makeRole: role_1.default, userDb: data_access_1.userDb, makeNotification: notification_1.default });
exports.internalUpdateDataRoleDetail = internalUpdateDataRoleDetail;
const internalUpdateDataRoleMapping = (0, update_role_mapping_2.default)({ roleDb: data_access_1.roleDb, makeRole: role_1.default, userDb: data_access_1.userDb, makeNotification: notification_1.default });
exports.internalUpdateDataRoleMapping = internalUpdateDataRoleMapping;
const internalDeleteDataRoleDetail = (0, delete_role_detail_2.default)({ roleDb: data_access_1.roleDb, userDb: data_access_1.userDb, makeNotification: notification_1.default });
exports.internalDeleteDataRoleDetail = internalDeleteDataRoleDetail;
const internalGetDataRole = (0, get_role_2.default)({ roleDb: data_access_1.roleDb, moment: moment_timezone_1.default, internalServer: middleware_1.internalServer });
exports.internalGetDataRole = internalGetDataRole;
const internalUpdateDataUserDetailRole = (0, update_user_detail_role_2.default)({ userDb: data_access_1.userDb, makeUser: user_1.default, makeRole: role_1.default, makeNotification: notification_1.default });
exports.internalUpdateDataUserDetailRole = internalUpdateDataUserDetailRole;
const internalUpdateDataUserDetailBranch = (0, update_user_detail_branch_2.default)({ userDb: data_access_1.userDb, makeBranch: branch_1.default, makeNotification: notification_1.default });
exports.internalUpdateDataUserDetailBranch = internalUpdateDataUserDetailBranch;
const internalUploadDataBranch = (0, upload_branch_2.default)({ branchDb: data_access_1.branchDb, userDb: data_access_1.userDb, makeNotification: notification_1.default, ExcelJs: exceljs_1.default, makeBranch: branch_1.default });
exports.internalUploadDataBranch = internalUploadDataBranch;
const internalUploadDataBranchReqWorkflow = (0, upload_branch_req_workflow_1.default)({ ExcelJs: exceljs_1.default, moment: moment_timezone_1.default });
exports.internalUploadDataBranchReqWorkflow = internalUploadDataBranchReqWorkflow;
const credentialModuleService = Object.freeze({
    getDataUser,
    getDataUserDetailRole,
    getDataUserDetailBranch,
    updateDataUserDetailRole,
    updateDataUserDetailBranch,
    downloadDataUserDetailBranch,
    downloadDataUserDetailRole,
    createDataRoleDetail,
    getDataRole,
    getDataRoleDetail,
    updateDataRoleDetail,
    updateDataRoleMapping,
    deleteDataRoleDetail,
    downloadDataRole,
    validasiDataRoleInput,
    validasiDataRoleDelete,
    createDataBranchDetail,
    updateDataBranchDetail,
    getDataBranch,
    getDataBranchDetail,
    deleteDataBranchDetail,
    uploadDataBranch,
    downloadDataBranch,
    validasiDataBranchInput,
    validasiDataBranchDelete,
    internalCreateDataBranchDetail,
    internalUpdateDataBranchDetail,
    internalDeleteDataBranchDetail,
    internalGetDataBranch,
    internalCreateDataRoleDetail,
    internalUpdateDataRoleDetail,
    internalUpdateDataRoleMapping,
    internalDeleteDataRoleDetail,
    internalGetDataRole,
    internalUpdateDataUserDetailRole,
    internalUpdateDataUserDetailBranch,
    internalUploadDataBranch,
    internalUploadDataBranchReqWorkflow
});
exports.default = credentialModuleService;
