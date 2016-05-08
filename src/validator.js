import {validationMetadataKey} from './metadata-key';
import {ValidationConfig} from './validation-config';
import {ValidationEngine} from 'aurelia-validation';
import {ValidationRule} from './validation-rule';
import {metadata} from 'aurelia-metadata';

export class Validator {
  object;
  config;
  validate(obj, prop) {
    let reporter = ValidationEngine.getValidationReporter(obj);
    if (prop) {
      this.config.validate(obj, reporter, prop);
    } else {
      this.config.validate(obj, reporter);
    }
  }
  getProperties() {
    console.error('Not yet implemented');
  }
  ensure(object, prop) {
    if (this.object && this.object !== object) {
      throw new Error('Validator cannot handle multiple objects');
    }
    this.object = object;
    let config = metadata.getOrCreateOwn(validationMetadataKey, ValidationConfig, this.object);
    this.config = config;
    this.currentProperty = prop;
    return this;
  }
  length(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.lengthRule(configuration));
    return this;
  }
  presence() {
    this.config.addRule(this.currentProperty, ValidationRule.presence());
    return this;
  }
  required() {
    this.config.addRule(this.currentProperty, ValidationRule.presence());
    return this;
  }
  numericality() {
    this.config.addRule(this.currentProperty, ValidationRule.numericality());
    return this;
  }
  date() {
    this.config.addRule(this.currentProperty, ValidationRule.date());
    return this;
  }
  datetime() {
    this.config.addRule(this.currentProperty, ValidationRule.datetime());
    return this;
  }
  email() {
    this.config.addRule(this.currentProperty, ValidationRule.email());
    return this;
  }
  equality(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.equality(configuration));
    return this;
  }
  format(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.format(configuration));
    return this;
  }
  inclusion(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.inclusion(configuration));
    return this;
  }
  exclusion(configuration) {
    this.config.addRule(this.currentProperty, ValidationRule.exclusion(configuration));
    return this;
  }
  url() {
    this.config.addRule(this.currentProperty, ValidationRule.url());
    return this;
  }
}
