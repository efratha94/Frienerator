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
        while (_) try {
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
exports.__esModule = true;
var express = require("express");
var router = express.Router();
var request = require("request");
var Episode = require("../models/Episode");
var SearchedWord = require("../models/SearchedWord");
var execSync = require("child_process").execSync;
var exec = require("child_process").exec;
var apiKey = "AIzaSyClzlqLX8CFQoL8l4ZwKjmp8LE-8KS4zjI";
var rp = require("request-promise");
var getTranscript = require('../modules/transcript');
var generateVideo = require('../modules/videoGenerator3');
router.get("/getVideo/:sentence", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var wordsLookupPromises, dbSearchPromises, dbUpdatePromises, apiPromisess, masterWordsData, sentenceToBuild, wordsToLookup, findEpisode, isMasterReadyVideoId, foundSearchedWords, retrieveIdsFromAPI;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wordsLookupPromises = [];
                dbSearchPromises = [];
                dbUpdatePromises = [];
                apiPromisess = [];
                masterWordsData = [] // variable that holds the data from E2E
                ;
                sentenceToBuild = req.params.sentence;
                wordsToLookup = sentenceToBuild.split(" ");
                findEpisode = function (word, i) {
                    return __awaiter(this, void 0, void 0, function () {
                        var getEpisode;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    getEpisode = Episode.aggregate([
                                        { $match: { $text: { $search: word }
                                            }
                                        },
                                        {
                                            $sample: { size: 1 }
                                        },
                                        {
                                            $project: { _id: 0, season: 1, episode: 1, videoIds: 1 }
                                        }
                                    ]);
                                    return [4 /*yield*/, getEpisode.then(function (episode) { masterWordsData[i] = episode.flat()[0]; })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                isMasterReadyVideoId = function () {
                    var _this = this;
                    var isEmpty = masterWordsData.some(function (object) { return object.videoIds.length == 0; });
                    if (isEmpty) {
                        var sendToApi = masterWordsData.filter(function (object) { return object.videoIds.length == 0; });
                        sendToApi.forEach(function (object) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, retrieveIdsFromAPI(object)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                    }
                    getTranscript();
                };
                wordsToLookup.forEach(function (word) {
                    wordsLookupPromises.push(SearchedWord.findOne({
                        word: new RegExp(word, 'i'),
                        isReady: true
                    }, {
                        _id: 0,
                        matchedEpisodes: 1
                    }));
                });
                return [4 /*yield*/, Promise.all(wordsLookupPromises)];
            case 1:
                foundSearchedWords = _a.sent();
                foundSearchedWords.forEach(function (word, i) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(word == null)) return [3 /*break*/, 2];
                                return [4 /*yield*/, findEpisode(wordsToLookup[i], i)];
                            case 1:
                                _c.sent();
                                isMasterReadyVideoId();
                                return [3 /*break*/, 4];
                            case 2:
                                _a = masterWordsData;
                                _b = i;
                                return [4 /*yield*/, word];
                            case 3:
                                _a[_b] = _c.sent();
                                masterWordsData[i].word = wordsToLookup[i];
                                masterWordsData[i].videoIds = ['notRelevant'];
                                _c.label = 4;
                            case 4:
                                console.log('rachel+well:', masterWordsData);
                                return [2 /*return*/];
                        }
                    });
                }); });
                retrieveIdsFromAPI = function (wordDataObj) {
                    return __awaiter(this, void 0, void 0, function () {
                        var resolvedApiPromises;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    apiPromisess.push(rp("https://www.googleapis.com/youtube/v3/search?part=snippet&q=friends%20s" + wordDataObj.season + "e" + wordDataObj.episode + "&type=video&key=" + apiKey + "&limit=1"));
                                    return [4 /*yield*/, Promise.all(apiPromisess)];
                                case 1:
                                    resolvedApiPromises = _a.sent();
                                    resolvedApiPromises.forEach(function (responseObj) {
                                        var videoIds = [];
                                        var items = JSON.parse(responseObj).items;
                                        items.forEach(function (item) { return videoIds.push(item.id.videoId); });
                                        wordDataObj.videoIds = videoIds;
                                        console.log(masterWordsData);
                                        masterWordsData.forEach(function (word) {
                                            return dbUpdatePromises.push(Episode.updateOne({
                                                season: word.season,
                                                episode: word.episode
                                            }, {
                                                $set: {
                                                    videoIds: word.videoIds
                                                }
                                            }));
                                        });
                                    });
                                    return [4 /*yield*/, Promise.all(dbUpdatePromises)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                };
                //start from here!
                // await getTranscript(wordDataObj.videoIds[0])
                // isMasterReadyWordTranscript()
                return [4 /*yield*/, generateVideo(wordsToLookup)];
            case 2:
                //start from here!
                // await getTranscript(wordDataObj.videoIds[0])
                // isMasterReadyWordTranscript()
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
