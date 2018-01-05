import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import ManageTabs from 'components/ManageTabs';
import styles from './index.scss';

@inject('rootStore')
@observer
export default class InstalledApps extends Component {
  render() {
    return (
      <div className={styles.apps}>
        <ManageTabs />
      </div>
    );
  }
}
