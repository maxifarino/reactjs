import React from 'react';
import { withRouter } from 'react-router-dom';
import NotesTasks from '../../../sc-profile/tabs/notesTasks';

class NotesTasksTab extends React.Component {
  render() {
    return (
      <NotesTasks fromHCtab hcId={this.props.match.params.hcId} />
    );
  }
}


export default withRouter(NotesTasksTab);
