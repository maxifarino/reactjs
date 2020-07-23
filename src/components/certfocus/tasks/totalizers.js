import React from 'react';
import PropTypes from 'prop-types';

const renderLink = (text, count, handler, unassigned, strong) => {
  let className = 'totalizerLink';
  if (unassigned) className += ' text-danger'
  if (strong) className += ' font-weight-bold';
  return (
    <a className={className} onClick={() => handler(strong, unassigned)}>{text}: {count}</a>
  )
}

const Totalizers = props => {

  const {totalCount, urgentCount, unassignedCount, urgentUnassignedCount,
    handleLink} = props;

  const {total, urgent, unassigned, urgentUnassigned} = props.locale;

  return (
    <div>
      <span className={'span-left'}>
        {renderLink(total, totalCount, handleLink, false, false)}
        {renderLink(urgent, urgentCount, handleLink, false, true)}
      </span>
      <span>
        {renderLink(unassigned, unassignedCount, handleLink, true, false)}
        {renderLink(urgentUnassigned, urgentUnassignedCount, handleLink, true, true)}
      </span>
    </div>
  );
};

Totalizers.propTypes = {
  total: PropTypes.number,
  urgent: PropTypes.number,
  unassigned: PropTypes.number,
  urgentUnassigned: PropTypes.number,
  locale: PropTypes.object,
  handleLink: PropTypes.func.isRequired,
};

export default Totalizers;