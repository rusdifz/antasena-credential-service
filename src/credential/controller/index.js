"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalUploadBranchReqWorkflow = exports.internalUploadBranch = exports.validasiBranchDelete = exports.validasiBranchInput = exports.downloadBranch = exports.uploadBranch = exports.deleteBranchDetail = exports.updateBranchDetail = exports.getBranchDetail = exports.getBranch = exports.createBranchDetail = exports.validasiRoleDelete = exports.validasiRoleInput = exports.downloadRole = exports.deleteRoleDetail = exports.updateRoleMapping = exports.updateRoleDetail = exports.getRoleDetail = exports.getRole = exports.createRoleDetail = exports.downloadUserDetailRole = exports.downloadUserDetailBranch = exports.updateUserDetailBranch = exports.updateUserDetailRole = exports.getUserDetailBranch = exports.getUserDetailRole = exports.getUser = exports.internalDownloadBranch = exports.internalUpdateUserDetailRole = exports.internalUpdateUserDetailBranch = exports.internalGetRole = exports.internalupdateRoleMapping = exports.internalUpdateRoleDetail = exports.internalDeleteRoleDetail = exports.internalCreateRoleDetail = exports.internalGetBranch = exports.internalUpdateBranchDetail = exports.internalDeleteBranchDetail = exports.internalCreateBranchDetail = void 0;
const helpers_1 = require("../helpers");
const use_case_1 = require("../use-case");
const middleware_1 = require("../middleware");
//internal
const create_branch_detail_1 = __importDefault(require("./internal/branch/create-branch-detail"));
const delete_branch_detail_1 = __importDefault(require("./internal/branch/delete-branch-detail"));
const update_branch_detail_1 = __importDefault(require("./internal/branch/update-branch-detail"));
const get_branch_1 = __importDefault(require("./internal/branch/get-branch"));
const create_role_detail_1 = __importDefault(require("./internal/role/create-role-detail"));
const delete_role_detail_1 = __importDefault(require("./internal/role/delete-role-detail"));
const update_role_detail_1 = __importDefault(require("./internal/role/update-role-detail"));
const update_role_mapping_1 = __importDefault(require("./internal/role/update-role-mapping"));
const get_role_1 = __importDefault(require("./internal/role/get-role"));
const update_user_detail_branch_1 = __importDefault(require("./internal/user/update-user-detail-branch"));
const update_user_detail_role_1 = __importDefault(require("./internal/user/update-user-detail-role"));
const download_branch_1 = __importDefault(require("./internal/branch/download-branch"));
const upload_branch_1 = __importDefault(require("./internal/branch/upload-branch"));
const upload_branch_req_workflow_1 = __importDefault(require("./internal/branch/upload-branch-req-workflow"));
const internalCreateBranchDetail = (0, create_branch_detail_1.default)({ internalCreateDataBranchDetail: use_case_1.internalCreateDataBranchDetail });
exports.internalCreateBranchDetail = internalCreateBranchDetail;
const internalDeleteBranchDetail = (0, delete_branch_detail_1.default)({ internalDeleteDataBranchDetail: use_case_1.internalDeleteDataBranchDetail });
exports.internalDeleteBranchDetail = internalDeleteBranchDetail;
const internalUpdateBranchDetail = (0, update_branch_detail_1.default)({ internalUpdateDataBranchDetail: use_case_1.internalUpdateDataBranchDetail });
exports.internalUpdateBranchDetail = internalUpdateBranchDetail;
const internalGetBranch = (0, get_branch_1.default)({ internalGetDataBranch: use_case_1.internalGetDataBranch });
exports.internalGetBranch = internalGetBranch;
const internalCreateRoleDetail = (0, create_role_detail_1.default)({ internalCreateDataRoleDetail: use_case_1.internalCreateDataRoleDetail });
exports.internalCreateRoleDetail = internalCreateRoleDetail;
const internalDeleteRoleDetail = (0, delete_role_detail_1.default)({ internalDeleteDataRoleDetail: use_case_1.internalDeleteDataRoleDetail });
exports.internalDeleteRoleDetail = internalDeleteRoleDetail;
const internalUpdateRoleDetail = (0, update_role_detail_1.default)({ internalUpdateDataRoleDetail: use_case_1.internalUpdateDataRoleDetail });
exports.internalUpdateRoleDetail = internalUpdateRoleDetail;
const internalupdateRoleMapping = (0, update_role_mapping_1.default)({ internalUpdateDataRoleMapping: use_case_1.internalUpdateDataRoleMapping });
exports.internalupdateRoleMapping = internalupdateRoleMapping;
const internalGetRole = (0, get_role_1.default)({ internalGetDataRole: use_case_1.internalGetDataRole });
exports.internalGetRole = internalGetRole;
const internalUpdateUserDetailBranch = (0, update_user_detail_branch_1.default)({ internalUpdateDataUserDetailBranch: use_case_1.internalUpdateDataUserDetailBranch });
exports.internalUpdateUserDetailBranch = internalUpdateUserDetailBranch;
const internalUpdateUserDetailRole = (0, update_user_detail_role_1.default)({ internalUpdateDataUserDetailRole: use_case_1.internalUpdateDataUserDetailRole });
exports.internalUpdateUserDetailRole = internalUpdateUserDetailRole;
const internalDownloadBranch = (0, download_branch_1.default)({});
exports.internalDownloadBranch = internalDownloadBranch;
const internalUploadBranch = (0, upload_branch_1.default)({ internalUploadDataBranch: use_case_1.internalUploadDataBranch });
exports.internalUploadBranch = internalUploadBranch;
const internalUploadBranchReqWorkflow = (0, upload_branch_req_workflow_1.default)({ internalUploadDataBranchReqWorkflow: use_case_1.internalUploadDataBranchReqWorkflow });
exports.internalUploadBranchReqWorkflow = internalUploadBranchReqWorkflow;
//user controller
const get_user_1 = __importDefault(require("./user/get-user"));
const get_user_detail_role_1 = __importDefault(require("./user/get-user-detail-role"));
const get_user_detail_branch_1 = __importDefault(require("./user/get-user-detail-branch"));
const update_user_detail_role_2 = __importDefault(require("./user/update-user-detail-role"));
const update_user_detail_branch_2 = __importDefault(require("./user/update-user-detail-branch"));
const download_user_detail_branch_1 = __importDefault(require("./user/download-user-detail-branch"));
const download_user_detail_role_1 = __importDefault(require("./user/download-user-detail-role"));
const getUser = (0, get_user_1.default)({ getDataUser: use_case_1.getDataUser, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getUser = getUser;
const getUserDetailRole = (0, get_user_detail_role_1.default)({ getDataUserDetailRole: use_case_1.getDataUserDetailRole, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getUserDetailRole = getUserDetailRole;
const getUserDetailBranch = (0, get_user_detail_branch_1.default)({ getDataUserDetailBranch: use_case_1.getDataUserDetailBranch, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getUserDetailBranch = getUserDetailBranch;
const updateUserDetailRole = (0, update_user_detail_role_2.default)({ updateDataUserDetailRole: use_case_1.updateDataUserDetailRole, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.updateUserDetailRole = updateUserDetailRole;
const updateUserDetailBranch = (0, update_user_detail_branch_2.default)({ updateDataUserDetailBranch: use_case_1.updateDataUserDetailBranch, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.updateUserDetailBranch = updateUserDetailBranch;
const downloadUserDetailBranch = (0, download_user_detail_branch_1.default)({ downloadDataUserDetailBranch: use_case_1.downloadDataUserDetailBranch });
exports.downloadUserDetailBranch = downloadUserDetailBranch;
const downloadUserDetailRole = (0, download_user_detail_role_1.default)({ downloadDataUserDetailRole: use_case_1.downloadDataUserDetailRole });
exports.downloadUserDetailRole = downloadUserDetailRole;
//role controller
const create_role_detail_2 = __importDefault(require("./role/create-role-detail"));
const get_role_2 = __importDefault(require("./role/get-role"));
const get_role_detail_1 = __importDefault(require("./role/get-role-detail"));
const update_role_detail_2 = __importDefault(require("./role/update-role-detail"));
const update_role_mapping_2 = __importDefault(require("./role/update-role-mapping"));
const delete_role_detail_2 = __importDefault(require("./role/delete-role-detail"));
const download_role_1 = __importDefault(require("./role/download-role"));
const validasi_role_input_1 = __importDefault(require("./role/validasi-role-input"));
const validasi_role_delete_1 = __importDefault(require("./role/validasi-role-delete"));
const createRoleDetail = (0, create_role_detail_2.default)({ createDataRoleDetail: use_case_1.createDataRoleDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.createRoleDetail = createRoleDetail;
const getRole = (0, get_role_2.default)({ getDataRole: use_case_1.getDataRole, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getRole = getRole;
const getRoleDetail = (0, get_role_detail_1.default)({ getDataRoleDetail: use_case_1.getDataRoleDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getRoleDetail = getRoleDetail;
const updateRoleDetail = (0, update_role_detail_2.default)({ updateDataRoleDetail: use_case_1.updateDataRoleDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.updateRoleDetail = updateRoleDetail;
const updateRoleMapping = (0, update_role_mapping_2.default)({ updateDataRoleMapping: use_case_1.updateDataRoleMapping, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.updateRoleMapping = updateRoleMapping;
const deleteRoleDetail = (0, delete_role_detail_2.default)({ deleteDataRoleDetail: use_case_1.deleteDataRoleDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.deleteRoleDetail = deleteRoleDetail;
const downloadRole = (0, download_role_1.default)({ downloadDataRole: use_case_1.downloadDataRole, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.downloadRole = downloadRole;
const validasiRoleInput = (0, validasi_role_input_1.default)({ validasiDataRoleInput: use_case_1.validasiDataRoleInput, internalServer: middleware_1.internalServer });
exports.validasiRoleInput = validasiRoleInput;
const validasiRoleDelete = (0, validasi_role_delete_1.default)({ validasiDataRoleDelete: use_case_1.validasiDataRoleDelete, internalServer: middleware_1.internalServer });
exports.validasiRoleDelete = validasiRoleDelete;
//branch controller
const create_branch_detail_2 = __importDefault(require("./branch/create-branch-detail"));
const get_branch_2 = __importDefault(require("./branch/get-branch"));
const get_branch_detail_1 = __importDefault(require("./branch/get-branch-detail"));
const update_branch_detail_2 = __importDefault(require("./branch/update-branch-detail"));
const delete_branch_detail_2 = __importDefault(require("./branch/delete-branch-detail"));
const upload_branch_2 = __importDefault(require("./branch/upload-branch"));
const download_branch_2 = __importDefault(require("./branch/download-branch"));
const validasi_branch_input_1 = __importDefault(require("./branch/validasi-branch-input"));
const validasi_branch_delete_1 = __importDefault(require("./branch/validasi-branch-delete"));
const createBranchDetail = (0, create_branch_detail_2.default)({ createDataBranchDetail: use_case_1.createDataBranchDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.createBranchDetail = createBranchDetail;
const getBranch = (0, get_branch_2.default)({ getDataBranch: use_case_1.getDataBranch, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getBranch = getBranch;
const getBranchDetail = (0, get_branch_detail_1.default)({ getDataBranchDetail: use_case_1.getDataBranchDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.getBranchDetail = getBranchDetail;
const updateBranchDetail = (0, update_branch_detail_2.default)({ updateDataBranchDetail: use_case_1.updateDataBranchDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.updateBranchDetail = updateBranchDetail;
const deleteBranchDetail = (0, delete_branch_detail_2.default)({ deleteDataBranchDetail: use_case_1.deleteDataBranchDetail, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.deleteBranchDetail = deleteBranchDetail;
const uploadBranch = (0, upload_branch_2.default)({ uploadDataBranch: use_case_1.uploadDataBranch, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.uploadBranch = uploadBranch;
const downloadBranch = (0, download_branch_2.default)({ downloadDataBranch: use_case_1.downloadDataBranch, internalServer: middleware_1.internalServer, redisClient: helpers_1.redisClient });
exports.downloadBranch = downloadBranch;
const validasiBranchInput = (0, validasi_branch_input_1.default)({ validasiDataBranchInput: use_case_1.validasiDataBranchInput, internalServer: middleware_1.internalServer });
exports.validasiBranchInput = validasiBranchInput;
const validasiBranchDelete = (0, validasi_branch_delete_1.default)({ validasiDataBranchDelete: use_case_1.validasiDataBranchDelete, internalServer: middleware_1.internalServer });
exports.validasiBranchDelete = validasiBranchDelete;
const credentialController = Object.freeze({
    internalCreateBranchDetail,
    internalDeleteBranchDetail,
    internalUpdateBranchDetail,
    internalGetBranch,
    internalCreateRoleDetail,
    internalDeleteRoleDetail,
    internalUpdateRoleDetail,
    internalupdateRoleMapping,
    internalGetRole,
    internalUpdateUserDetailBranch,
    internalUpdateUserDetailRole,
    internalDownloadBranch,
    getUser,
    getUserDetailRole,
    getUserDetailBranch,
    updateUserDetailRole,
    updateUserDetailBranch,
    downloadUserDetailBranch,
    downloadUserDetailRole,
    createRoleDetail,
    getRole,
    getRoleDetail,
    updateRoleDetail,
    updateRoleMapping,
    deleteRoleDetail,
    downloadRole,
    validasiRoleInput,
    validasiRoleDelete,
    createBranchDetail,
    getBranch,
    getBranchDetail,
    updateBranchDetail,
    deleteBranchDetail,
    uploadBranch,
    downloadBranch,
    validasiBranchInput,
    validasiBranchDelete,
    internalUploadBranch,
    internalUploadBranchReqWorkflow
});
exports.default = credentialController;
