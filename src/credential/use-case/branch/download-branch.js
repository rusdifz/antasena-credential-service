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
function makeDownloadDataBranch({ branchDb, ExcelJs, moment }) {
    return function downloadDataBranch(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBranchDb = yield branchDb.downloadBranch(body);
                let result;
                if (getBranchDb.status == true) {
                    const dataBranch = yield Promise.all(getBranchDb.data.map(data => {
                        let updatedTime;
                        if (data.updated_time == null) {
                            updatedTime = null;
                        }
                        else {
                            updatedTime = moment(data.updated_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
                        }
                        const branch = {
                            id: data.id,
                            branch_id: data.branch_id,
                            branch_name: data.branch_name,
                            created_user: data.created_user,
                            created_time: moment(data.created_time).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss'),
                            updated_user: data.updated_user,
                            updated_time: updatedTime
                        };
                        return branch;
                    }));
                    const workbook = new ExcelJs.Workbook(); //creating workbook
                    const worksheet = workbook.addWorksheet('Data Branch'); //creating worksheet
                    //  WorkSheet Header
                    const kolom = [
                        { header: 'Branch Id', key: 'branch_id', width: 15 },
                        { header: 'Branch Name', key: 'branch_name', width: 20 },
                        { header: 'Created User', key: 'created_user', width: 25 },
                        { header: 'Created Time', key: 'created_time', width: 20 },
                        { header: 'Updated User', key: 'updated_user', width: 25 },
                        { header: 'Updated Time', key: 'updated_time', width: 20 }
                    ];
                    worksheet.columns = kolom;
                    worksheet.addRows(dataBranch);
                    worksheet.getRow(1).eachCell((cell) => {
                        cell.font = { bold: true };
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    });
                    const basedir = __dirname;
                    const fileDir = basedir.toString().replace(/branch/, 'file/');
                    const filename = 'branch.xlsx';
                    const writefile = yield workbook.xlsx.writeFile(fileDir + filename);
                    result = { status: true, data: filename };
                }
                else {
                    result = getBranchDb;
                }
                return result;
            }
            catch (error) {
                throw new Error('usecase-downloadDataBranch ' + error);
            }
        });
    };
}
exports.default = makeDownloadDataBranch;
