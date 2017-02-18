import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import emailValidator from 'email-validator';

import * as actions from '../../actions';

class SetNewPassword extends Component {
  handleFormSubmit({ password }) {
    const { resetToken } = this.props.params;
    this.props.saveNewPassword({ resetToken, password });
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
          <label>New Password:</label>
          <Field name="password" type="password" className="form-control" component={this.renderInput} />
        </fieldset>
        <fieldset className="form-group">
          <label>Confirm New Password:</label>
          <Field name="passwordConfirm" type="password" className="form-control" component={this.renderInput} />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Set New Password</button>
      </form>
    );
  }
}

function validate({ password, passwordConfirm }) {
  const errors = {};

  if (!password) {
    errors.password = 'Please enter an password';
  }

  if (password !== passwordConfirm) {
    errors.password = 'Passwords must match';
  }

  if (!passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.resetPassword.new.error,
    successMessage: state.resetPassword.new.message,
  };
}

export default connect(mapStateToProps, actions)
  (reduxForm({ form: 'SetNewPassword', validate })(SetNewPassword));
