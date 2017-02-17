import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import emailValidator from 'email-validator';

import * as actions from '../../actions';

class ResetPassword extends Component {
  handleFormSubmit({ email }) {
    this.props.sendResetPasswordLink({ email })
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
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Oops!</strong> {this.props.errorMessage}
        </div>
      );
    } else if (this.props.successMessage) {
      return (
        <div className="alert alert-success">
          <strong>Cool!</strong> {this.props.successMessage}
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
          <label>Email</label>
          <Field name="email" className="form-control" component={this.renderInput} />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Send Reset Link</button>
      </form>
    );
  }
}

function validate({ email }) {
  const errors = {};

  if (!emailValidator.validate(email)) {
    errors.email = 'Please enter your valid email address';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.resetPassword.error,
    successMessage: state.resetPassword.message,
  };
}

export default connect(mapStateToProps, actions)
  (reduxForm({ form: 'ResetPassword', validate })(ResetPassword));
