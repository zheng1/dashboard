import { observable, action } from 'mobx';
import Store from '../Store';
import _ from 'lodash';
import { getFormData } from 'utils';

export default class RuntimeCreateStore extends Store {
  @observable runtimeId = '';
  @observable name = '';
  @observable provider = 'qingcloud';
  @observable zone = 'pek3a';
  @observable description = '';
  @observable runtimeUrl = '';
  @observable accessKey = '';
  @observable secretKey = '';
  @observable curLabelKey = '';
  @observable curLabelValue = '';
  @observable labels = [];
  @observable runtimeCreated = null;
  @observable isLoading = false;

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeUrl = e => {
    this.runtimeUrl = e.target.value;
  };

  @action
  changeDescription = e => {
    this.description = e.target.value;
  };

  @action
  changeProvider = provider => {
    this.provider = provider;
  };

  @action
  changeZone = zone => {
    this.zone = zone;
  };

  @action
  changeAccessKey = e => {
    this.accessKey = e.target.value;
  };

  @action
  changeSecretKey = e => {
    this.secretKey = e.target.value;
  };

  @action
  handleValidateCredential = () => {
    this.showMsg(this.accessKey && this.secretKey ? 'valid credential' : 'invalid credential');
  };

  @action
  addLabel = () => {
    if (!(this.curLabelKey && this.curLabelValue)) {
      return this.showMsg('please input label key and value');
    }
    if (_.find(this.labels, { label_key: this.curLabelKey })) {
      return this.showMsg('label key already exists');
    }

    this.labels.push({
      label_key: this.curLabelKey,
      label_value: this.curLabelValue
    });

    this.curLabelKey = '';
    this.curLabelValue = '';
  };

  @action
  changeLabelKey = e => {
    this.curLabelKey = e.target.value;
  };

  @action
  changeLabelValue = e => {
    this.curLabelValue = e.target.value;
  };

  @action
  removeLabel = key => {
    this.labels = this.labels.filter(label => {
      return label.label_key !== key;
    });
  };

  @action
  handleSubmit = async e => {
    e.preventDefault();
    this.isLoading = true;
    const { provider, zone, labels } = this;

    const data = getFormData(e.target);

    if (_.isEmpty(labels)) {
      this.isLoading = false;
      return this.showMsg('missing labels');
    }

    if (provider === 'qingcloud') {
      data.runtime_credential = JSON.stringify({
        access_key_id: this.accessKey,
        secret_access_key: this.secretKey
      });
    } else if (provider === 'kubernetes') {
      let credential = data.credential;
      delete data.credential;
      data.runtime_url = 'https://api.qingcloud.com';
      data.runtime_credential = credential;
    }

    data.labels = labels
      .map(label => {
        return [label.label_key, label.label_value].join('=');
      })
      .join('&');

    _.extend(data, { provider, zone });

    if (this.runtimeId) {
      _.extend(data, { runtime_id: this.runtimeId });
      await this.modifyRuntime(data);
    } else {
      await this.create(data);
    }

    // todo
    if (this.runtimeCreated.runtime) {
      this.showMsg('create or modify runtime successfully');
    } else {
      let { errDetail } = this.runtimeCreated;
      this.showMsg(errDetail);
    }

    // disable re-submit form in 2 sec
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  };

  @action
  async create(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.runtimeCreated = await this.request.post('runtimes', params);
  }
  @action
  async modifyRuntime(params) {
    params = typeof params === 'object' ? params : JSON.stringify(params);
    this.runtimeCreated = await this.request.patch('runtimes', params);
  }

  @action
  reset() {
    this.hideMsg();
    this.runtimeId = '';
    this.name = '';
    this.provider = 'qingcloud';
    this.zone = 'pek3a';
    this.runtimeUrl = '';
    this.description = '';
    this.accessKey = '';
    this.secretKey = '';
    this.curLabelKey = '';
    this.curLabelValue = '';
    this.labels = [];
    this.runtimeCreated = null;
    this.isLoading = false;
  }

  @action
  setRuntime = detail => {
    if (detail) {
      this.runtimeId = detail.runtime_id;
      this.name = detail.name;
      this.provider = detail.provider;
      this.runtimeUrl = detail.runtime_url;
      this.zone = detail.zone;
      this.description = detail.description;
      const credential = JSON.parse(detail.runtime_credential);
      this.accessKey = credential.access_key_id;
      this.secretKey = credential.secret_access_key;
      this.labels = detail.labels || [];
    }
  };
}