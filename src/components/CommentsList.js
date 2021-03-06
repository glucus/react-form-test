import React from 'react';
import CommentCounter from './CommentCounter';
import Comment from './Comment';
import CommentForm from './CommentForm';

class CommentsList extends React.Component {

  constructor (props) {
    super (props);

    this.state = {
      comments: props.sampleComments,
      newComment: {author: '', date: '', text: '', likes: 0, responses: [],
                   id: 0, commentId: null},
      respondToComment: null,
      commentsCount: this.sampleCommentsCountResult
    }

    this.submitComment = this.submitComment.bind (this);
    this.handleChange = this.handleChange.bind (this);
    this.respondToComment = this.respondToComment.bind (this);
  }

  countSampleComments () {
    let levelOneCount = this.props.sampleComments.length;
    let responsesCountArr = this.props.sampleComments.map (
      comment => comment.responses.length
    );
    let responsesCount = responsesCountArr.reduce ((a,b) => a+b);
    let result = levelOneCount + responsesCount;
    return result; 
  }
  
  sampleCommentsCountResult = this.countSampleComments();

  handleChange (event) {
    let newComment = {};
    newComment.text = event.target.value;
    this.setState ({newComment: newComment});
  }

  respondToComment (event) {
    let respondToComment = event.target.id;
    let form = document.getElementsByTagName('form');
    let formIndex = this.props.articleId;
    form[formIndex].children[0].focus();
    this.setState ({respondToComment: respondToComment});
  }

  submitComment (event) {
      event.preventDefault();
      let date = new Date();
      let commentId = this.state.respondToComment;

      let newComment = Object.assign ({}, this.state.newComment,
        {
          author: 'guest',
          id: Date.now(),
          date: date.toLocaleString(),
          responses: [],
          commentId: commentId === null ? null : parseInt (commentId, 10)
        }
      );

      let comments = Object.assign ([], this.state.comments);

      if (newComment.commentId === null) {
        comments.push(newComment);
      } else {

        let targetCommentsArr = comments.filter(comment => comment.id === newComment.commentId);
        let targetComment = targetCommentsArr[0];
        let targetIndex = comments.indexOf (targetComment);

        targetComment.responses.push(newComment);
        comments.splice (targetIndex, 1, targetComment);
      }

      let form = document.getElementsByTagName('form');
      let formIndex = this.props.articleId;
      form[formIndex].children[1].blur();

      this.setState (prevState => ({
        comments: comments,
        commentsCount: prevState.commentsCount + 1,
        respondToComment: null,
        newComment: {author: '', date: '', text: '', likes: 0, responses: [],
        id: 0, commentId: null}
      })
    );
  }
  
  render () {
    return (
      <div>
        <CommentCounter commentsCount={this.state.commentsCount}/>

        {this.state.comments.map (
          comment => <Comment
                        key={comment.id}
                        id={comment.id}
                        author={comment.author}
                        date={comment.date}
                        text={comment.text}
                        likes={comment.likes}
                        responses={comment.responses}
                        onClick = {this.respondToComment}
                      />
        )}

        < CommentForm value={this.state.newComment.text}
                      onChange={this.handleChange}
                      onSubmit={this.submitComment}
        />
      </div>
    );
  }
}

export default CommentsList;