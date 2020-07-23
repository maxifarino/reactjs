import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from './actions';

let imageCount = 0

class VideoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      selectedName: '',
      showVideoSidebar: false,
      imgCount: 0
    }
    // let roleId = props.login.profile.RoleID
    // props.actions.fetchVideoData(roleId);

    this.renderVideoImages = this.renderVideoImages.bind(this)
    this.renderVideo = this.renderVideo.bind(this)
    this.handleVideoStartEvent = this.handleVideoStartEvent.bind(this)
    this.isThisVidSelected = this.isThisVidSelected.bind(this)
    this.countImages = this.countImages.bind(this)
  }

  countImages() {
    this.setState({
      imgCount: this.state.imgCount++
    })
  }

  componentWillMount() {
    let roleId = this.props.login.profile.RoleID
    if (roleId) {
      this.props.actions.fetchVideoData(roleId)
    }
  }

  componentWillReceiveProps(nextProps) {
    let
      roleId     = nextProps.login.profile.RoleID,
      { videos } = this.props.videos,
      nextVideos = nextProps.videos.videos

    if (roleId !== this.props.login.profile.RoleID) {
      this.props.actions.fetchVideoData(roleId)
    }

    if (nextVideos.length > 0) {
      // console.log('this kicked off nextVideos = ', nextVideos)

      if (imageCount != nextVideos.length) {
        nextVideos.forEach( (vid) => {
          let imgId = vid.VimeoID
          imageCount++
          // console.log('imgId = ', imgId)
          this.props.actions.fetchVideoImages(imgId)
        })
      }
    }

    if ((typeof videos.length == 'number' && typeof nextVideos.length == 'number') && videos.length != nextVideos.length) {
      this.setState({
        showVideoSidebar: true
      })
    }
  }

  handleVideoStartEvent(e, id, Name) {
    e.preventDefault()
    this.setState({
      selectedId: id,
      selectedName: Name
    })
  }

  isThisVidSelected(id) {
    return id === this.state.selectedId;
  }

  sortVideosAndImages = (videos, images) => {
    // console.log('videos before = ', videos)
    // console.log('images before = ', images)
    videos.sort((videoA, videoB) => {return videoA.DisplayOrder - videoB.DisplayOrder});
    // console.log('videos after = ', videos)
    let output = [...videos]
  
    for (let i=0; i<output.length; i++) {
      for (let k=0; k<images.length; k++) {
        if (output[i].VimeoID == images[k].imgId) {
          output[i].image =  images[k].content ? `data:image/jpeg;base64,${images[k].content}` : 'http://via.placeholder.com/350x170'
        }
      }
    }
    return output
  }

  renderVideoImages() {
    const { selectedId } = this.state
    const origWidth = 250
    const origHeight = 360/640*origWidth
    const icon = 'linear-icon-chevron-right iconSettings'
    const isThisVidSelected = this.state.selectedId
    let { videos, images } = this.props.videos
    let vidList = ''
    videos  = this.sortVideosAndImages(videos, images)
    vidList = videos.map((video) =>

      <div key={video.VimeoID} className="vidImgWrapper">
        {
          this.isThisVidSelected(video.VimeoID)
            ? <div 
                className={icon}
                style={{
                  height: `${origHeight}px`,
                  width: `${origWidth}px`
                }}
              ></div>
            : <img 
                src={video.image}
                onClick={(e) => { this.handleVideoStartEvent(e, video.VimeoID, video.Name) }}
                style={{
                  height: `${origHeight}px`,
                  width: `${origWidth}px`
                }}
              />
        }
        <p className='videoTitleSm'>{ video.Name }</p>
      </div>
    )

    return (
      <div className='vidContainer'>{vidList}</div>
    )
  }

  renderVideo() {
    let
      //h = 360,
      //w = 640,
      id = this.state.selectedId
    return (
      <iframe
        title="video"
        src={`https://player.vimeo.com/video/${id}`}
        className='actualVid'
        frameBorder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen="true"
      ></iframe>
    )
  }

  render() {

   const { showVideoSidebar } = this.state

    return (
      <div className="videoPage">
        <div className="vidSideBar">
          {
            showVideoSidebar
            ? <div className='renderVidImgWrapper'>
                {
                  !this.props.videos.fetchingVideoHeader
                  ? this.renderVideoImages()
                  : <div className="spinner-wrapper">
                      <div className="spinner"></div>
                    </div>
                }
              </div>
            : ''
          }
        </div>
        <div className='vidNTitle'>
          {
            !showVideoSidebar
            ? <p className='screen-title' style={{ textAlign: 'center', paddingRight: '40%', marginTop: '10%' }}>Videos Coming Soon!</p>
            : ''
          }
          <div className="videoTitleLg">
            { this.state.selectedTitle }

          </div>
          <div className='vidWrapper'>
            {
              this.state.selectedId
                ? this.renderVideo()
                : ''
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    local: state.localization,
    login: state.login,
    videos: state.videos
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoPage);
