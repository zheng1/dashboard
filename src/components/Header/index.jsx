import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Popover, Icon, Input } from 'components/Base';
import { getSessInfo } from 'src/utils';
import Logo from '../Logo';

import styles from './index.scss';

// translate hoc should place before mobx
@translate()
@inject('rootStore', 'sessInfo')
@observer
class Header extends Component {
  static propTypes = {
    isHome: PropTypes.bool
  };

  onSearch = async value => {
    const { appStore } = this.props.rootStore;
    this.props.history.push('/store/search/' + value);
    await appStore.fetchAll({ search_word: value });
    appStore.homeApps = appStore.apps;
  };

  onClearSearch = async () => {
    this.props.history.push('/');
  };

  isLinkActive = (curLink, match, location) => {
    const { pathname } = location;
    return pathname.indexOf(curLink) > -1;
  };

  renderMenus = () => {
    const { t } = this.props;

    return (
      <div className={styles.menus}>
        <NavLink
          to="/store"
          exact
          activeClassName={styles.active}
          isActive={this.isLinkActive.bind(null, 'store')}
        >
          {t('Store')}
        </NavLink>
        <NavLink
          to="/purchased"
          exact
          activeClassName={styles.active}
          isActive={this.isLinkActive.bind(null, 'purchased')}
        >
          {t('Purchased')}
        </NavLink>
        <NavLink
          to="/runtimes"
          exact
          activeClassName={styles.active}
          isActive={this.isLinkActive.bind(null, 'runtime')}
        >
          {t('My runtimes')}
        </NavLink>
      </div>
    );
  };

  renderOperateMenu = () => {
    const { t } = this.props;

    return (
      <ul className={styles.operateItems}>
        <li>
          <Link to="/dashboard">{t('Dashboard')}</Link>
        </li>
        <li>
          <Link to="/profile">{t('Profile')}</Link>
        </li>
        <li>
          <Link to="/ssh_keys">{t('SSH Keys')}</Link>
        </li>
        <li>
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  };

  renderMenuBtns() {
    const { t } = this.props;
    const loggedInUser = getSessInfo('user', this.props.sessInfo);

    if (!loggedInUser) {
      return (
        <NavLink to="/login" className={styles.login}>
          {t('Sign In')}
        </NavLink>
      );
    }

    return (
      <div className={styles.user}>
        <Popover content={this.renderOperateMenu()}>
          {loggedInUser}
          <Icon name="caret-down" className={styles.iconDark} type="dark" />
        </Popover>
      </div>
    );
  }

  render() {
    const {
      t,
      isHome,
      match,
      rootStore: { fixNav }
    } = this.props;

    const hasMenu = getSessInfo('role', this.props.sessInfo) === 'user';
    const logoUrl = !isHome || fixNav ? '/logo_light.svg' : '/logo_dark.svg';
    const needShowSearch = isHome && fixNav;
    const appSearch = match.params.search;

    return (
      <div
        className={classnames('header', styles.header, {
          [styles.deep]: !isHome,
          [styles.deepHome]: isHome && fixNav
        })}
      >
        <div className={styles.wrapper}>
          <Logo className={styles.logo} url={logoUrl} />
          <div className={styles.menuOuter}>
            {hasMenu && this.renderMenus()}
            {this.renderMenuBtns()}
          </div>
          {needShowSearch && (
            <Input.Search
              className={styles.search}
              placeholder={t('search.placeholder')}
              value={appSearch}
              onSearch={this.onSearch}
              onClear={this.onClearSearch}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
