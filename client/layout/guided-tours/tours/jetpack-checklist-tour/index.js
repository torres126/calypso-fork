/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import meta from './meta';
import { ButtonRow, makeTour, Next, Quit, Step, Tour } from 'layout/guided-tours/config-elements';

export const JetpackChecklistTour = makeTour(
	<Tour { ...meta }>
		<Step
			arrow="bottom-left"
			name="init"
			placement="above"
			style={ {
				marginTop: '-20px',
			} }
			target={ '.jetpack-checklist__header' }
		>
			{ ( { translate } ) => (
				<>
					<p>
						{ translate(
							"This is your security checklist that'll help you quickly set up Jetpack. " +
								'Pick and choose the features that you want.'
						) }
					</p>
					<ButtonRow>
						<Next step="return-button">{ translate( 'Got it' ) }</Next>
					</ButtonRow>
				</>
			) }
		</Step>

		<Step
			arrow="bottom-right"
			name="return-button"
			placement="above"
			style={ {
				marginTop: '-25px',
			} }
			target="jetpack-checklist-wpadmin-link"
		>
			{ ( { translate } ) => (
				<>
					<p>
						{ translate(
							"After you're done setting everything up, you can return to your WordPress " +
								'admin here or continue using this dashboard.'
						) }
					</p>
					<ButtonRow>
						<Next step="finish">{ translate( 'Got it' ) }</Next>
					</ButtonRow>
				</>
			) }
		</Step>

		<Step
			arrow="bottom-right"
			name="finish"
			placement="above"
			style={ {
				margin: '-20px 0 0 -2px',
			} }
			target=".inline-help"
		>
			{ ( { translate } ) => (
				<>
					<p>{ translate( "If you run into any issues, we'd be happy to help!" ) }</p>
					<ButtonRow>
						<Quit primary>{ translate( 'Got it' ) }</Quit>
					</ButtonRow>
				</>
			) }
		</Step>
	</Tour>
);
