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
function makeInternalDownloadBranch({}) {
    return function internalDownloadBranch(httpRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let posted = httpRequest.params.code;
                return {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Last-Modified': new Date(posted.createdTime).toUTCString()
                    },
                    statusCode: 200,
                    body: {
                        responseCode: 200,
                        nameFile: posted
                    },
                    downloadfile: 'yes'
                };
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
exports.default = makeInternalDownloadBranch;
