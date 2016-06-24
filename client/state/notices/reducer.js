/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import omit from 'lodash/omit';
import reduce from 'lodash/reduce';

/**
 * Internal dependencies
 */
import {
	NEW_NOTICE,
	REMOVE_NOTICE,
	ROUTE_SET
} from 'state/action-types';
import { createReducer } from 'state/utils';

export const items = createReducer( {}, {
	[ NEW_NOTICE ]: ( state, action ) => {
		const { notice } = action;
		return {
			...state,
			[ notice.noticeId ]: notice
		};
	},
	[ REMOVE_NOTICE ]: ( state, action ) => {
		const { noticeId } = action;
		if ( ! state.hasOwnProperty( noticeId ) ) {
			return state;
		}

		return omit( state, noticeId );
	},
	[ ROUTE_SET ]: ( state ) => {
		return reduce( state, ( memo, notice, noticeId ) => {
			if ( ! notice.isPersistent && ! notice.displayOnNextPage ) {
				return memo;
			}

			let nextNotice = notice;
			if ( nextNotice.displayOnNextPage ) {
				nextNotice = {
					...nextNotice,
					displayOnNextPage: false
				};
			}

			memo[ noticeId ] = nextNotice;
			return memo;
		}, {} );
	}
} );

export default combineReducers( {
	items
} );
