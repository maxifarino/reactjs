import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CommentForm from "./form/commentForm";

class CFTaskComments extends Component {

  render() {
    const { handleCommentSubmit } = this.props;
    return (
      <CommentForm
        onSubmit={handleCommentSubmit}
        />
    );
  }
}

CFTaskComments.propTypes = {
  handleCommentSubmit: PropTypes.func.isRequired,
};

export default CFTaskComments;