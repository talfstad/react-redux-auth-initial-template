import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class Signin extends Component {

  handleFormSubmit({ email, password }) {
    // Need to do something to log user in
    this.props.signinUser({ email, password });
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  render() {
    // comes from redux-form
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(o => this.handleFormSubmit(o))}>
        <fieldset className="form-group">
          <label>Email</label>
          <Field name="email" component="input" className="form-control"/>
        </fieldset>
        <fieldset className="form-group">
          <label>Password</label>
          <Field name="password" component="input" type="password" className="form-control"/>
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign in</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)
  (reduxForm({ form: 'Signin' })(Signin));
