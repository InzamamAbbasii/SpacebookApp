import { all } from 'redux-saga/effects';

import {
	answerSagas
} from './Modules/Answer/saga.answer';
import {
	answerLaterSagas
} from './Modules/AnswerLater/saga.answerLater';
import {
	articleSaga
}
	from './Modules/Articles/saga.articles';
import {
	authsaga
} from './Modules/Auth/saga.auth';
import {
	blockUserSagas
} from './Modules/BlockUser/saga.blockUser';

import {
	bookmarkSagas
} from './Modules/Bookmarks/saga.bookmarks';
import {
	categorySagas
} from './Modules/Category/saga.category';
import {
	commentVoteSagas
} from './Modules/CommentVote/saga.commentVote';
import {
	commonSagas
} from './Modules/CommonActions/saga.common';
import {
	creditRequestSagas
} from './Modules/CreditRequest/saga.creditRequest';
import {
	draftSagas
} from './Modules/Draft/saga.drafts';
import {
	followSuggestionSagas
} from './Modules/FollowSuggestion/saga.followSuggestion';

import {
	followTopicSagas,
} from './Modules/FollowTopics/saga.followTopic';
import {
	notificationSagas
} from './Modules/Notifications/saga.notification';
import {
	profileSagas
} from './Modules/Profile/saga.profile';
import {
	questionSagas
} from './Modules/Question/saga.question';
import {
	readLaterSagas
} from './Modules/ReadLater/saga.readLater';
import {
	reportAnswerSagas
} from './Modules/ReportAnswer/saga.reportAnswer';
import {
	reportCommentSagas
} from './Modules/ReportComment/saga.reportComment';
import {
	reportUserSagas
} from './Modules/ReportUser/saga.reportUser';

import {
	searchSagas
} from './Modules/Search/saga.search';
import {
	topicSagas
} from './Modules/Topics/saga.topics';
import {
	userSagas
} from './Modules/User/saga.user';
import {
	voteSagas
} from './Modules/Votes/saga.votes';

/**
 * All the sagas are defined over here
 * @returns {object} The respective saga to return
 */
export default function* rootSagas() {
	try {

		yield all(
			[

				...authsaga,

				...topicSagas,

				...profileSagas,

				...answerSagas,

				...bookmarkSagas,

				...categorySagas,

				...questionSagas,

				...followTopicSagas,

				...answerLaterSagas,

				...categorySagas,

				...userSagas,

				...readLaterSagas,

				...draftSagas,

				...voteSagas,

				...searchSagas,

				...notificationSagas,

				...followSuggestionSagas,

				...creditRequestSagas,

				...commentVoteSagas,

				...blockUserSagas,

				...reportUserSagas,

				...commonSagas,

				...reportAnswerSagas,

				...reportCommentSagas,

				...articleSaga
			]
		);
	} catch (error) {
		// TODO:Need to return the correct error at this stage
		throw new Error(error);
	}
}