/**
 * External dependencies
 */
import React, { useState, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import type { ExPlatClient, ExperimentAssignment } from '@automattic/explat-client';

interface ExPlatClientReactHelpers {
	/**
	 * An ExPlat useExperiment hook.
	 *
	 * NOTE: Doesn't obey ExperimentAssignment TTL in order to keep stable UX.
	 *
	 * @returns [isExperimentAssignmentLoading, ExperimentAssignment | null]
	 */
	useExperiment: ( experimentName: string ) => [ boolean, ExperimentAssignment | null ];

	/**
	 * Experiment component, safest and simplest, should be first choice if usable.
	 */
	Experiment: ( props: {
		name: string;
		children: { default: React.ReactNode; treatment: React.ReactNode; loading: React.ReactNode };
	} ) => JSX.Element;

	/**
	 * Inject experiment data into a child component.
	 * Use when hooks aren't available.
	 */
	ProvideExperimentData: ( props: {
		children: (
			isLoading: boolean,
			experimentAssignment: ExperimentAssignment | null
		) => JSX.Element;
		name: string;
	} ) => JSX.Element;
}

export default function createExPlatClientReactHelpers(
	exPlatClient: ExPlatClient
): ExPlatClientReactHelpers {
	const useExperiment = ( experimentName: string ): [ boolean, ExperimentAssignment | null ] => {
		const [ previousExperimentName ] = useState( experimentName );
		const [ state, setState ] = useState< [ boolean, ExperimentAssignment | null ] >( [
			true,
			null,
		] );

		useEffect( () => {
			let isSubscribed = true;
			exPlatClient.loadExperimentAssignment( experimentName ).then( ( experimentAssignment ) => {
				if ( isSubscribed ) {
					setState( [ false, experimentAssignment ] );
				}
			} );
			return () => {
				isSubscribed = false;
			};
			// We don't expect experimentName to ever change and if it does we want to assignment to stay constant.
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [] );

		if (
			experimentName !== previousExperimentName &&
			! previousExperimentName.startsWith( 'explat_test' )
		) {
			exPlatClient.config.logError( {
				message: '[ExPlat] useExperiment: experimentName should never change between renders!',
			} );
		}

		return state;
	};

	const Experiment = ( {
		children,
		name: experimentName,
	}: {
		children: { default: React.ReactNode; treatment: React.ReactNode; loading: React.ReactNode };
		name: string;
	} ): JSX.Element => {
		const [ isLoading, experimentAssignment ] = useExperiment( experimentName );
		if ( isLoading ) {
			return <>{ children.loading }</>;
		} else if ( ! experimentAssignment?.variationName ) {
			return <>{ children.default }</>;
		}
		return <>{ children.treatment }</>;
	};

	const ProvideExperimentData = ( {
		children,
		name: experimentName,
	}: {
		children: (
			isLoading: boolean,
			experimentAssignment: ExperimentAssignment | null
		) => JSX.Element;
		name: string;
	} ): JSX.Element => {
		const [ isLoading, experimentAssignment ] = useExperiment( experimentName );
		return children( isLoading, experimentAssignment );
	};

	return {
		useExperiment,
		Experiment,
		ProvideExperimentData,
	};
}
