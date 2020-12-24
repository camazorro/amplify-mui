import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSignUp } from 'amplify-auth-hooks';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';

import { FormSection, SectionHeader, SectionBody, SectionFooter } from '../ui';
import { useNotificationContext } from '../notification';
import { ChangeAuthStateLink } from './change-auth-state-link';

const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    submit: {
      margin: theme.spacing(3, 0, 2)
    }
  })
);

const defaultSignUpFields = [
  {
    label: 'Username',
    key: 'username',
    required: true,
    type: 'text',
    displayOrder: 1,
    intl: {
      label: 'global.labels.username'
    }
  },
  {
    label: 'Password',
    key: 'password',
    required: true,
    type: 'password',
    displayOrder: 2,
    intl: {
      label: 'global.labels.password'
    }
  },
  {
    label: 'Email',
    key: 'email',
    required: true,
    type: 'email',
    displayOrder: 3,
    intl: {
      label: 'global.labels.email'
    }
  }
];

const sortByDisplayOrder = (a, b?) => {
  if (a.displayOrder === undefined) {
    return -1;
  }

  if (b?.displayOrder === undefined) {
    return 1;
  }

  return Math.sign(a.displayOrder - (b.displayOrder ?? 0));
};

export const SignUp = (props) => {
  const { validationData, signUpConfig } = props;

  const signUpFields = signUpConfig?.signUpFields ?? defaultSignUpFields;
  const initialValues = signUpConfig?.initialValues ?? {};
  signUpFields.forEach(
    (field) => (initialValues[field.key] = initialValues[field.key] ?? '')
  );

  const classes = useStyles();
  const { formatMessage } = useIntl();
  const { showNotification } = useNotificationContext();
  const signUp = useSignUp();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async ({ email, password, ...attributes }) => {
        try {
          await signUp(email, password, validationData, attributes);
        } catch (error) {
          const content = formatMessage({
            id: `signUp.errors.${error.code}`,
            defaultMessage: error.message
          });
          showNotification({ content, variant: 'error' });
        }
      }}
    >
      {({ handleSubmit, isValid }) => (
        <FormSection>
          <SectionHeader>
            <FormattedMessage
              id="signUp.header"
              defaultMessage="Create a new account"
            />
          </SectionHeader>
          <Form className={classes.form} onSubmit={handleSubmit}>
            <SectionBody>
              {signUpFields
                .sort(sortByDisplayOrder)
                .map(
                  ({
                    displayOrder,
                    label,
                    placeholder,
                    intl,
                    ...inputProps
                  }) => {
                    return (
                      <Field
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name={inputProps.key}
                        label={
                          intl?.label !== undefined
                            ? formatMessage({
                                id: intl.label,
                                defaultMessage: label
                              })
                            : label
                        }
                        {...inputProps}
                        component={TextField}
                      />
                    );
                  }
                )}
            </SectionBody>
            <SectionFooter>
              <Button
                type="submit"
                disabled={!isValid}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                <FormattedMessage
                  id="signUp.buttons.create"
                  defaultMessage="Create Account"
                />
              </Button>
              <Grid container>
                <Grid item xs>
                  <FormattedMessage
                    id="signUp.text.haveAccount"
                    defaultMessage="Have an account?"
                  />{' '}
                  <ChangeAuthStateLink
                    label={formatMessage({
                      id: 'signUp.links.signIn',
                      defaultMessage: 'Sign in'
                    })}
                    newState="signIn"
                  />
                </Grid>
              </Grid>
            </SectionFooter>
          </Form>
        </FormSection>
      )}
    </Formik>
  );
};
