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

$.lang.register('noticehandler.notice-config', 'Notice Settings - [Notice Toggle: $1 / Interval: $2 / Message Trigger: $3 / Amount: $4 / Say notice in offline chat: $5]');
$.lang.register('noticehandler.notice-usage', 'Usage: !notice [add / get / remove / edit / config / interval / req / toggle / toggleoffline]');
$.lang.register('noticehandler.notice-get-usage', 'Usage: !notice get (notice id) - Notice id\'s go from 0 to $1');
$.lang.register('noticehandler.notice-error-notice-404', 'That notice does not exist.');
$.lang.register('noticehandler.notice-edit-usage', 'Usage: !notice edit (notice id) (message) - Notice id\'s go from 0 to $1');
$.lang.register('noticehandler.notice-remove-usage', 'Usage: !notice remove (notice id) - Notice id\'s go from 0 to $1');
$.lang.register('noticehandler.notice-edit-success', 'Notice edited!');
$.lang.register('noticehandler.notice-remove-success', 'Notice removed!');
$.lang.register('noticehandler.notice-add-success', 'Notice added!');
$.lang.register('noticehandler.notice-add-usage', 'Usage: !notice add (message)');
$.lang.register('noticehandler.notice-interval-usage', 'Usage: !notice interval (interval)');
$.lang.register('noticehandler.notice-interval-404', 'Notice interval needs to be more then 2 minutes.');
$.lang.register('noticehandler.notice-inteval-success', 'Notice interval set!');
$.lang.register('noticehandler.notice-req-success', 'Notice req message set!');
$.lang.register('noticehandler.notice-req-usage', 'Usage: !notice req (req messages)');
$.lang.register('noticehandler.notice-req-404', 'Notice req messages needs to at least 1.');
$.lang.register('noticehandler.notice-enabled', 'Notices have been enabled!');
$.lang.register('noticehandler.notice-disabled', 'Notices have been disabled.');
$.lang.register('noticehandler.notice-enabled.offline', 'Notices now be said while the stream is offline.');
$.lang.register('noticehandler.notice-disabled.offline', 'Notices will no longer be said while the stream is offline.');
