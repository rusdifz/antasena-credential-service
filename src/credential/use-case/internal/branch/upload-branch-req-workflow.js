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
function makeInternalUploadBranchReqWorkflow({ ExcelJs, moment }) {
    return function internalUploadBranchReqWorkflow(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workbook = new ExcelJs.Workbook(); //creating workbook
                let dataBranch = [];
                const bufferExcel = Buffer.from(body.file.data);
                let branchId = [];
                yield workbook.xlsx.load(bufferExcel).then(function () {
                    const worksheet = workbook.getWorksheet(1);
                    worksheet.eachRow(function (row, rowNumber) {
                        if (rowNumber > 1) {
                            const data = {
                                branchId: row._cells[0]._value.value,
                                branchName: row._cells[1]._value.value
                            };
                            dataBranch.push(data);
                            branchId.push(data.branchId);
                        }
                    });
                });
                const basedir = __dirname;
                const filedir = basedir.toString().replace(/branch/, '');
                const fileDir = filedir.replace(/internal/, "file");
                const filename = 'branch-upload-new-' + moment().tz("Asia/Jakarta").format('YYMMDDHHmmss') + '.xlsx';
                const writefile = yield workbook.xlsx.writeFile(fileDir + filename);
                const result = {
                    status: true,
                    responseCode: 200,
                    data: {
                        fileLocation: fileDir + filename,
                        fileName: filename,
                        UrlDownload: process.env.URL_HOST_ME + '/branch/download/workflow/' + filename,
                        urlUpload: process.env.URL_HOST_ME + '/branch/upload/workflow/'
                    }
                };
                return result;
            }
            catch (error) {
                throw new Error('internalUploadBranchReqWorkflow ' + error);
            }
        });
    };
}
exports.default = makeInternalUploadBranchReqWorkflow;
