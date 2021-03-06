import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { ProviderName } from 'components/TdName';
import AppImages from 'components/AppImages';
import TagShow from 'components/TagShow/index';

import styles from './index.scss';

@translate()
export default class RepoCard extends PureComponent {
  static propTypes = {
    repoId: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    providers: PropTypes.array,
    apps: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tags: PropTypes.array
  };

  render() {
    const { repoId, name, description, providers, apps, total, tags, t } = this.props;

    return (
      <div className={styles.repoCard}>
        <div className={styles.inner}>
          <div className={styles.column}>
            <div className={styles.titleName}>
              <Link to={`/dashboard/repo/${repoId}`}>{name}</Link>
            </div>
            <div className={styles.description}>{description}</div>
          </div>
          <div className={styles.column}>
            <div className={styles.title}>{t('Runtime Provider')}</div>
            <div className={styles.providerImg}>
              {providers.map(provider => (
                <ProviderName key={provider} name={provider} provider={provider} />
              ))}
            </div>
          </div>
          <div className={styles.column}>
            <AppImages apps={apps} total={total} />
          </div>
        </div>
        <TagShow tags={tags} tagStyle="purple2" />
      </div>
    );
  }
}
