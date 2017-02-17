import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import * as actions from '../../actions';
import { connect } from 'react-redux';

class Signup extends Component {
  handleFormSubmit(formProps) {
    // Call action creator to sign up user
    this.props.signupUser(formProps);
  }

  renderInput(props) {
    const {
      className,
      type,
      input,
      input: { value },
      meta: { error, touched },
    } = props;

    // if err, touched both return true return the last part
    return (
      <div>
        <input type={type} className={className} {...input} />
        {error && touched && <div className="error">{error}</div>}
      </div>
    );
  }

  renderAlert() {
    const { errorMessage } = this.props;
    if (errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {errorMessage}
        </div>
      );
    }
    return <noscript />;
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(o => this.handleFormSubmit(o))}>
        <fieldset className="form-group">
          <label>Email:</label>
          <Field name="email" className="form-control" component={this.renderInput} />
        </fieldset>
        <fieldset className="form-group">
          <label>Password:</label>
          <Field name="password" type="password" className="form-control" component={this.renderInput} />
        </fieldset>
        <fieldset className="form-group">
          <label>Confirm Password:</label>
          <Field name="passwordConfirm" type="password" className="form-control" component={this.renderInput} />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">
          Sign up!
        </button>
      </form>
    );
  }
}

function validate(formProps) {
  const errors = {};

  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }

  if (!formProps.password) {
    errors.password = 'Please enter an password';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
  }
}

export default connect(mapStateToProps, actions)
  (reduxForm({ form: 'Signup', validate })(Signup));
