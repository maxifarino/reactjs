import React from 'react';

const CertUploadError = props => {
	return (
		<div className="add-item-view add-entity-form-small">
			<section className="white-section">
				<div style={{ display: 'inline-block', margin: '50px', textAlign: 'left' }}>
					{`The ${props.match.params.holderName} has advised that a certificate of insurance is no longer required for this request. If additional documentation is required a separate email request will be sent. Thank you for using Vertikal.`}
				</div>
			</section>
		</div>
	);
};

export default CertUploadError;