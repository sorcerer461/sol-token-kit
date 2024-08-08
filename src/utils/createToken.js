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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var config_1 = require("../../config/config");
var sendBundle_1 = require("./jitoBundle/sendBundle");
var createToken = function (tokenInfo, revokeMintBool, revokeFreezeBool) { return __awaiter(void 0, void 0, void 0, function () {
    var lamports, mintKeypair, myPublicKey, tokenATA, createMetadataInstruction, createNewTokenTransaction, revokeMint, revokeFreeze, blockhash, success, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!true) return [3 /*break*/, 8];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, spl_token_1.getMinimumBalanceForRentExemptMint)(config_1.connection)];
            case 2:
                lamports = _a.sent();
                mintKeypair = web3_js_1.Keypair.generate();
                myPublicKey = config_1.LP_wallet_keypair.publicKey;
                return [4 /*yield*/, (0, spl_token_1.getAssociatedTokenAddress)(mintKeypair.publicKey, myPublicKey)];
            case 3:
                tokenATA = _a.sent();
                createMetadataInstruction = (0, mpl_token_metadata_1.createCreateMetadataAccountV3Instruction)({
                    metadata: web3_js_1.PublicKey.findProgramAddressSync([
                        Buffer.from("metadata"),
                        mpl_token_metadata_1.PROGRAM_ID.toBuffer(),
                        mintKeypair.publicKey.toBuffer(),
                    ], mpl_token_metadata_1.PROGRAM_ID)[0],
                    mint: mintKeypair.publicKey,
                    mintAuthority: myPublicKey,
                    payer: myPublicKey,
                    updateAuthority: myPublicKey,
                }, {
                    createMetadataAccountArgsV3: {
                        data: {
                            name: tokenInfo.tokenName,
                            symbol: tokenInfo.symbol,
                            uri: tokenInfo.metadata,
                            creators: null,
                            sellerFeeBasisPoints: 0,
                            uses: null,
                            collection: null,
                        },
                        isMutable: true,
                        collectionDetails: null,
                    },
                });
                createNewTokenTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
                    fromPubkey: myPublicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: spl_token_1.MINT_SIZE,
                    lamports: lamports,
                    programId: spl_token_1.TOKEN_PROGRAM_ID,
                }), (0, spl_token_1.createInitializeMintInstruction)(mintKeypair.publicKey, tokenInfo.decimals, myPublicKey, myPublicKey, spl_token_1.TOKEN_PROGRAM_ID), (0, spl_token_1.createAssociatedTokenAccountInstruction)(myPublicKey, tokenATA, myPublicKey, mintKeypair.publicKey), (0, spl_token_1.createMintToInstruction)(mintKeypair.publicKey, tokenATA, myPublicKey, tokenInfo.amount * Math.pow(10, tokenInfo.decimals)), createMetadataInstruction);
                if (revokeMintBool) {
                    revokeMint = (0, spl_token_1.createSetAuthorityInstruction)(mintKeypair.publicKey, // mint account || token account
                    myPublicKey, // current auth
                    spl_token_1.AuthorityType.MintTokens, // authority type
                    null);
                    createNewTokenTransaction.add(revokeMint);
                }
                if (revokeFreezeBool) {
                    revokeFreeze = (0, spl_token_1.createSetAuthorityInstruction)(mintKeypair.publicKey, // mint account || token account
                    myPublicKey, // current auth
                    spl_token_1.AuthorityType.FreezeAccount, // authority type
                    null);
                    createNewTokenTransaction.add(revokeFreeze);
                }
                return [4 /*yield*/, config_1.connection.getLatestBlockhash("finalized")];
            case 4:
                blockhash = (_a.sent())
                    .blockhash;
                createNewTokenTransaction.feePayer = config_1.LP_wallet_keypair.publicKey;
                createNewTokenTransaction.recentBlockhash = blockhash;
                createNewTokenTransaction.sign(config_1.LP_wallet_keypair, mintKeypair);
                return [4 /*yield*/, (0, sendBundle_1.sendBundle)([createNewTokenTransaction])];
            case 5:
                success = _a.sent();
                if (success) {
                    console.log("Token Created : ", tokenInfo);
                    console.log("Token Mint Address :", mintKeypair.publicKey.toString());
                    return [2 /*return*/, mintKeypair.publicKey];
                }
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.log("Error creating token: ", error_1);
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 0];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createToken = createToken;
