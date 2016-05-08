import {Validator} from 'src/validator';
import {ValidationReporter} from 'src/validation-reporter';
import {ValidationEngine, ValidationError, validationMetadataKey} from 'aurelia-validation';
import {Container} from 'aurelia-dependency-injection';
import {ValidationConfig} from 'src/validation-config';
import {metadata} from 'aurelia-metadata';

describe('Validator', () => {
  let injectedValidator;
  let container;
  let validation;
  let reporter;
  let target;

  describe('when validating against view-model-like object', () => {

    beforeEach(() => {
      container = new Container();
      injectedValidator = container.get(Validator);
    });

    describe('with a single property', () => {
      describe('with a single rule', () => {

        class Target {
          firstName = 'Patrick';
        }

        beforeEach(() => {
          target = new Target();
          metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target);
          validator = injectedValidator
              .ensure(target, 'firstName')
                .length({minimum: 3});
        });

        describe('.validate', () => {
          it('runs validation against the correct instance / config', (done) => {
            reporter = ValidationEngine.getValidationReporter(target);
            spyOn(reporter, 'publish');
            validator.validate(target);
            setTimeout(() => {
              expect(reporter.publish).toHaveBeenCalled();
              done();
            }, 1);
          });

          it('validates the proper rules', (done) => {
            let error = new ValidationError({})
            error.message = 'First name is too short (minimum is 3 characters)';
            error.propertyName = 'firstName';
            let expectedResult = [error];
            reporter = ValidationEngine.getValidationReporter(target);
            spyOn(reporter, 'publish');
            target.firstName = 'no';
            validator.validate(target);
            setTimeout(() => {
              expect(reporter.publish).toHaveBeenCalledWith(expectedResult);
              done();
            }, 1);
          });

          it('returns an existing reporter if present', () => {
            let vrInstance = new ValidationReporter();
            vrInstance.uniqueId = 1;
            let mockInstance = { __validationReporter__: vrInstance };
            let result = ValidationEngine.getValidationReporter(mockInstance);
            expect(result).toEqual(vrInstance);
          });
        });
      });

      describe('with multiple rules', () => {

        class Target {
          firstName = 'Patrick';
        }

        beforeEach(() => {
          target = new Target();
          metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target);

          validator = injectedValidator
              .ensure(target, 'firstName')
                .numericality()
                .length({minimum: 3});
        });

        describe('.validate', () => {

          it('validates the proper rules', (done) => {
            let errorOne = new ValidationError({});
            let errorTwo = new ValidationError({});
            errorOne.message = 'First name is not a number';
            errorOne.propertyName = 'firstName';
            errorTwo.message = 'First name is too short (minimum is 3 characters)';
            errorTwo.propertyName = 'firstName';
            let expectedResult = [errorOne, errorTwo];
            reporter = ValidationEngine.getValidationReporter(target);
            spyOn(reporter, 'publish');
            target.firstName = 'no';
            validator.validate(target);
            setTimeout(() => {
              expect(reporter.publish).toHaveBeenCalledWith(expectedResult);
              done();
            }, 1);
          });
        });
      });
    });

    describe('with multiple properties to validate', () => {

      class Target {
        firstName = 'Patrick';
        lastName = 'Walters';
      }

      beforeEach(() => {
        target = new Target();
        metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target);

        validator = injectedValidator
            .ensure(target, 'firstName')
              .length({minimum: 3})
            .ensure(target, 'lastName')
              .length({minimum: 3});
      });

      describe('.validate', () => {

        it('validates the proper rules', (done) => {
          let errorOne = new ValidationError({});
          let errorTwo = new ValidationError({});
          errorOne.message = 'First name is too short (minimum is 3 characters)';
          errorOne.propertyName = 'firstName';
          errorTwo.message = 'Last name is too short (minimum is 3 characters)';
          errorTwo.propertyName = 'lastName';
          let expectedResult = [errorOne, errorTwo];
          reporter = ValidationEngine.getValidationReporter(target);
          spyOn(reporter, 'publish');
          target.firstName = 'no';
          target.lastName = 'no';
          validator.validate(target);
          setTimeout(() => {
            expect(reporter.publish).toHaveBeenCalledWith(expectedResult);
            done();
          }, 1);
        });

        it('runs validation against the correct instance / config', (done) => {
          reporter = ValidationEngine.getValidationReporter(target);
          spyOn(reporter, 'publish');
          validator.validate(target);
          setTimeout(() => {
            expect(reporter.publish).toHaveBeenCalled();
            done();
          }, 1);
        });
      });
    });
  });

  describe('when validating against a model on a view-model', () => {
    class TargetModel {
      firstName = 'Patrick';
    }

    class Target {
      model = new TargetModel();
    }

    beforeEach(() => {
      container = new Container();
      injectedValidator = container.get(Validator);
      target = new Target();
      metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, target.model);

      validator = injectedValidator
        .ensure(target.model, 'firstName')
          .length({minimum: 3});
    });

    describe('.validate', () => {
      it('runs validation against the correct instance / config', (done) => {
        reporter = ValidationEngine.getValidationReporter(target.model);
        spyOn(reporter, 'publish');
        validator.validate(target.model);
        setTimeout(() => {
          expect(reporter.publish).toHaveBeenCalled();
          done();
        }, 1);
      });
    });
  });
});
