/*
 * Copyright (C) 2016-2018 phantombot.tv
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * pollSystem.js
 *
 * This module enables the channel owner to start/manage polls
 * Start/stop polls is exported to $.poll for use in other scripts
 */

function asyncLoop(times, loopFn, callback) {
    function asyncIterate (time) {
        if(time === times) { return callback(); }
        loopFn(time, function () {
            asyncIterate(time + 1);
        });
    } 

    asyncIterate(0);
};

(function() {
    var poll = {
            pollId: 0,
            options: [],
            votes: [],
            voters: [],
            callback: function() {},
            pollRunning: false,
            draftRunning: false,
            pollMaster: '',
            time: 0,
            question: '',
            minVotes: 0,
            result: '',
            hasTie: 0,
            counts: [],
        },
        timeout;
    var objOBS = [];

    /**
     * @function hasKey
     * @param {Array} list
     * @param {*} value
     * @param {Number} [subIndex]
     * @returns {boolean}
     */
    function hasKey(list, value, subIndex) {
        var i;

        if (subIndex > -1) {
            for (i in list) {
                if (list[i][subIndex].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        } else {
            for (i in list) {
                if (list[i].equalsIgnoreCase(value)) {
                    return true;
                }
            }
        }
        return false;
    };

    // Compile regular expressions.
    var rePollOpenFourOptions = new RegExp(/"([\w\W]+)"\s+"([\w\W]+)"\s+(\d+)\s+(\d+)/),
        rePollOpenThreeOptions = new RegExp(/"([\w\W]+)"\s+"([\w\W]+)"\s+(\d+)/),
        rePollOpenTwoOptions = new RegExp(/"([\w\W]+)"\s+"([\w\W]+)"/),
        draftOpenOneOptions = new RegExp(/(\d+)/);

    function cardsToTime (count) {
        var cardsToTimeArray = [5, 10, 20, 20, 30, 40, 50, 50, 60, 70, 80, 80];

        if (count < 1) { return 5; }
        if (count > 12) { return 90; }
        return cardsToTimeArray[count - 1];
    };

    const timeToStart = 5;

    function valueToCountingArray (count) {
        var arr = new Array(count);
        for(var i = 0; i < count; ++i) {
            arr[i] = "" + (i + 1);
        }
        return arr;
    };

    /**
     * @function runDraft
     * @export $.poll
     * @param {Number} count
     * @param {string} pollMaster
     * @param {Function} callback
     * @returns {boolean}
     */
    function runDraft(cards, pollMaster, callback) {
        if (poll.draftRunning) { return false; }
        poll.draftRunning = true;
        asyncLoop(
            cards,
            function(count, itercallback) {
                const cardsRemaining = cards - count;
                const question = "Card " + (count + 1);
                const time = parseInt(cardsToTime(cardsRemaining));
                $.say($.lang.get('pollsystem.draft.test', timeToStart, cardsRemaining, time));
                setTimeout(function(){
                    runPoll(question, valueToCountingArray(cardsRemaining), time, pollMaster, 1, function(winner) {
                        if (winner === false) {
                            $.say($.lang.get('pollsystem.runpoll.novotes', question));
                        } else if (poll.hasTie) {
                            // $.say($.lang.get('pollsystem.runpoll.tie', question));
                            $.say($.lang.get('pollsystem.runpoll.tieWinner', question, winner));
                        } else {
                            $.say($.lang.get('pollsystem.runpoll.winner', question, winner));
                        }
                        itercallback();
                    });
                }, 1000 * timeToStart);
            },
            function() {
                poll.draftRunning = false;
                callback();
            }
        );
        return true;
    };

    /**
     * @function runPoll
     * @export $.poll
     * @param {string} question
     * @param {Array} options
     * @param {Number} time
     * @param {string} pollMaster
     * @param {Number} [minVotes]
     * @param {Function} callback
     * @param {string} [initialVote]
     * @returns {boolean}
     */
    function runPoll(question, options, time, pollMaster, minVotes, callback) {
        var optionsStr = "";

        if (poll.pollRunning) {
            return false
        }

        objOBS = [];

        poll.pollRunning = true;
        poll.pollMaster = pollMaster;
        poll.time = (parseInt(time) * 1000);
        poll.callback = callback;
        poll.question = question;
        poll.options = options;
        poll.minVotes = (minVotes ? minVotes : 1);
        poll.votes = [];
        poll.voters = [];
        poll.counts = [];
        poll.hasTie = 0;

        // Remove the old files.
        $.inidb.RemoveFile('pollPanel');
        $.inidb.RemoveFile('pollVotes');

        $.inidb.setAutoCommit(false);
        for (var i = 0; i < poll.options.length; i++) {
            optionsStr += (i + 1) + ") " + poll.options[i] + " ";
            $.inidb.set('pollVotes', poll.options[i].replace(/\s/, '%space_option%'), 0);
            objOBS.push({
                'label': poll.options[i],
                'votes': 0
            });
        }
        $.inidb.setAutoCommit(true);

        if (poll.time > 0) {
            if(poll.options.length < 6) {
                poll.options.forEach(function (opt, i) {
                    $.say($.lang.get('pollsystem.poll.started.option', (i + 1) + ") " + opt));
                });
            } else {
                $.say($.lang.get('pollsystem.poll.started', $.resolveRank(pollMaster), time, poll.minVotes, poll.question, optionsStr));
            }

            timeout = setTimeout(function() {
                endPoll();
            }, poll.time);
        } else {
            $.say($.lang.get('pollsystem.poll.started.nottime', $.resolveRank(pollMaster), poll.minVotes, poll.question, optionsStr));
        }

        $.panelsocketserver.sendToAll(JSON.stringify({
            'start_poll': 'true',
            'data': JSON.stringify(objOBS)
        }));

        $.inidb.set('pollPanel', 'title', question);
        $.inidb.set('pollPanel', 'options', options.join('%space_option%'));
        $.inidb.set('pollPanel', 'isActive', 'true');
        return true;
    };

    /**
     * @function vote
     * @param {string} sender
     * @param {string} voteText
     */
    function vote(sender, voteText) {
        var optionIndex;

        if (!poll.pollRunning) {
            return;
        }

        if (hasKey(poll.voters, sender.toLowerCase())) {
            $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.vote.already'));
            return;
        }

        optionIndex = parseInt(voteText);
        if (isNaN(optionIndex) || optionIndex < 1 || optionIndex > poll.options.length) {
            $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.vote.invalid', voteText));
            return;
        }

        optionIndex--;
        poll.voters.push(sender);
        poll.votes.push(optionIndex);
        for (var i = 0; i < objOBS.length; i++) {
            if (objOBS[i].label == poll.options[optionIndex])
                objOBS[i].votes++;
        }
        $.panelsocketserver.sendToAll(JSON.stringify({
            'new_vote': 'true',
            'data': JSON.stringify(objOBS)
        }));
        $.inidb.incr('pollVotes', poll.options[optionIndex].replace(/\s/, '%space_option%'), 1);
    };

    /**
     * @function endPoll
     * @export $.poll
     */
    function endPoll() {
        var mostVotes = -1,
            i;

        if (!poll.pollRunning) {
            return;
        }

        clearTimeout(timeout);

        $.inidb.set('pollPanel', 'isActive', 'false');
        $.panelsocketserver.sendToAll(JSON.stringify({
            'end_poll': 'true'
        }));
        if (poll.minVotes > 0 && poll.votes.length < poll.minVotes) {
            poll.result = '';
            poll.pollMaster = '';
            poll.pollRunning = false;
            poll.callback(false);
            return;
        }

        for (i = 0; i < poll.options.length; poll.counts.push(0), i++);
        for (i = 0; i < poll.votes.length; poll.counts[poll.votes[i++]] += 1);
        for (i = 0; i < poll.counts.length; winner = ((poll.counts[i] > mostVotes) ? i : winner), mostVotes = ((poll.counts[i] > mostVotes) ? poll.counts[i] : mostVotes), i++);
        for (i = 0; i < poll.counts.length;
            (i != winner && poll.counts[i] == poll.counts[winner] ? poll.hasTie = 1 : 0), (poll.hasTie == 1 ? i = poll.counts.length : 0), i++);

        poll.result = poll.options[winner];
        poll.pollMaster = '';
        poll.pollRunning = false;

        // Store the results for the Panel to read.
        $.inidb.set('pollresults', 'question', poll.question);
        $.inidb.set('pollresults', 'result', poll.result);
        $.inidb.set('pollresults', 'votes', poll.votes.length);
        $.inidb.set('pollresults', 'options', poll.options.join(','));
        $.inidb.set('pollresults', 'counts', poll.counts.join(','));
        $.inidb.set('pollresults', 'istie', poll.hasTie);
        poll.callback(poll.result);
    };

    /**
     * @event command
     */
    $.bind('command', function(event) {
        var sender = event.getSender().toLowerCase(),
            command = event.getCommand(),
            argsString = event.getArguments().trim(),
            args = event.getArgs(),
            action = args[0];

        if (command.equalsIgnoreCase('vote') && action !== undefined) {
            if (poll.pollRunning) {
                vote(sender, action);
            }
        }

        /**
         * @commandpath poll - Announce information about a poll, if one is running.
         */
        if (command.equalsIgnoreCase('poll') || command.equalsIgnoreCase('draft')) {
            if (!action) {
                if (poll.pollRunning) {
                    var optionsStr = "";
                    for (var i = 0; i < poll.options.length; i++) {
                        optionsStr += (i + 1) + ") " + poll.options[i] + (i == poll.options.length - 1 ? "" : " ");
                    }
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.poll.running', poll.question, optionsStr));
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.poll.usage'));
                }
                return;
            }

            /**
             * @commandpath poll results - Announce result information about the last run poll (Poll information is retained until shutdown)
             */
            if (action.equalsIgnoreCase('results')) {
                if (poll.pollRunning) {
                    $.say($.lang.get('pollsystem.results.running'));
                } else if (poll.result != '') {
                    if (poll.hasTie) {
                        $.say($.lang.get('pollsystem.results.lastpoll', poll.question, poll.votes.length, "Tie!", poll.options.join(', '), poll.counts.join(', ')));
                    } else {
                        $.say($.lang.get('pollsystem.results.lastpoll', poll.question, poll.votes.length, poll.result, poll.options.join(', '), poll.counts.join(', ')));
                    }
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.results.404'));
                }
            }

            /**
             * @commandpath draft open count ["option1, option2, ..."] [seconds] [min votes] - Starts a poll with question and options. Optionally provide seconds and min votes.
             * @param {Number} count
             * @param {Function} callback
             */

            if (command.equalsIgnoreCase('draft') && action.equalsIgnoreCase('open')) {
                var count = 1;

                argsString = argsString + ""; // Cast as a JavaScript string.

                if (argsString.match(draftOpenOneOptions)) {
                    count = parseInt(argsString.match(draftOpenOneOptions)[1]);
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.draft.usage'));
                    return;
                }

                if (!count) {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.draft.usage'));
                    return;
                }

                if (runDraft(count, sender, function() { $.say($.lang.get('pollsystem.draft.complete')); })) {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.draft.started', count));
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.draft.running'));
                }
                return;
            }

            /**
             * @commandpath poll open ["poll question"] ["option1, option2, ..."] [seconds] [min votes] - Starts a poll with question and options. Optionally provide seconds and min votes.
             */
            if (action.equalsIgnoreCase('open')) {
                var time = 0,
                    question = '',
                    options = [],
                    minVotes = 1;

                argsString = argsString + ""; // Cast as a JavaScript string.

                if (argsString.match(rePollOpenFourOptions)) {
                    question = argsString.match(rePollOpenFourOptions)[1];
                    options = argsString.match(rePollOpenFourOptions)[2].split(/,\s*/);
                    time = parseInt(argsString.match(rePollOpenFourOptions)[3]);
                    minVotes = parseInt(argsString.match(rePollOpenFourOptions)[4]);
                } else if (argsString.match(rePollOpenThreeOptions)) {
                    question = argsString.match(rePollOpenThreeOptions)[1];
                    options = argsString.match(rePollOpenThreeOptions)[2].split(/,\s*/);
                    time = parseInt(argsString.match(rePollOpenThreeOptions)[3]);
                } else if (argsString.match(rePollOpenTwoOptions)) {
                    question = argsString.match(rePollOpenTwoOptions)[1];
                    options = argsString.match(rePollOpenTwoOptions)[2].split(/,\s*/);
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.open.usage'));
                    return;
                }

                if (!question || !options || options.length === 0 || isNaN(minVotes) || minVotes < 1) {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.open.usage'));
                    return;
                }
                if (options.length === 1) {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.open.moreoptions'));
                    return;
                }

                if (runPoll(question, options, parseInt(time), sender, minVotes, function(winner) {
                        if (winner === false) {
                            $.say($.lang.get('pollsystem.runpoll.novotes', question));
                            return;
                        }
                        if (poll.hasTie) {
                            // $.say($.lang.get('pollsystem.runpoll.tie', question));
                            $.say($.lang.get('pollsystem.runpoll.tieWinner', question, winner));
                        } else {
                            $.say($.lang.get('pollsystem.runpoll.winner', question, winner));
                        }
                    })) {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.runpoll.started'));
                } else {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.results.running'));
                }
            }

            /**
             * @commandpath poll close - Close the current poll and tally the votes
             */
            if (action.equalsIgnoreCase('close')) {
                if (!poll.pollRunning) {
                    $.say($.whisperPrefix(sender) + $.lang.get('pollsystem.close.nopoll'));
                    return;
                }
                endPoll();
            }
        }
    });

    /**
     * @event initReady
     */
    $.bind('initReady', function() {
        $.registerChatCommand('./systems/pollSystem.js', 'poll', 2);
        $.registerChatCommand('./systems/pollSystem.js', 'draft', 2);
        $.registerChatCommand('./systems/pollSystem.js', 'vote', 7);
        $.registerChatSubcommand('poll', 'results', 2);
        $.registerChatSubcommand('poll', 'open', 2);
        $.registerChatSubcommand('draft', 'open', 2);
        $.registerChatSubcommand('poll', 'close', 2);
    });

    /** Export functions to API */
    $.poll = {
        runDraft: runDraft,
        runPoll: runPoll,
        endPoll: endPoll
    };
})();
