import { connect } from 'react-redux';
import Users from './Users';
import {
  changeFollowStatusAC,
  setUsersAC,
  setPageAC,
  setTotalUsersAC,
  setCurrentPagesAC,
  toggleLoadingAC,
} from './../../redux/users-page-reducer';
import * as axios from 'axios';
import React from 'react';

class UsersContainer extends React.Component {
  componentDidMount = () => {
    this.props.toggleLoading();
    axios
      .get(
        `https://social-network.samuraijs.com/api/1.0/users?page=${this.props.page}&count=${this.props.pageSize}`,
      )
      .then((response) => {
        this.props.setUsers(response.data.items);
        this.props.setTotalUsers(response.data.totalCount);
        this.props.toggleLoading();
      });
  };

  changePage = (page) => {
    this.props.toggleLoading();
    this.props.setPage(page);
    axios
      .get(
        `https://social-network.samuraijs.com/api/1.0/users?page=${page}&count=${this.props.pageSize}`,
      )
      .then((response) => {
        this.props.setUsers(response.data.items);
        this.props.toggleLoading();
      });
  };

  render() {
    return (
      <Users
        state={this.props.state}
        changeFollowStatus={this.props.changeFollowStatus}
        totalUsers={this.props.totalUsers}
        pageSize={this.props.pageSize}
        changePage={this.changePage}
        page={this.props.page}
        currentPagesBeginning={this.props.currentPagesBeginning}
        setCurrentPages={this.props.setCurrentPages}
        isLoading={this.props.isLoading}
      />
    );
  }
}

let mapStateToProps = (state) => {
  return {
    state: state.usersPage,
    page: state.usersPage.page,
    pageSize: state.usersPage.pageSize,
    totalUsers: state.usersPage.totalUsers,
    currentPagesBeginning: state.usersPage.currentPagesBeginning,
    isLoading: state.usersPage.isLoading,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    changeFollowStatus: (id) => {
      dispatch(changeFollowStatusAC(id));
    },
    setUsers: (users) => {
      dispatch(setUsersAC(users));
    },
    setPage: (page) => {
      dispatch(setPageAC(page));
    },
    setTotalUsers: (totalUsers) => {
      dispatch(setTotalUsersAC(totalUsers));
    },
    setCurrentPages: (newBeginning) => {
      dispatch(setCurrentPagesAC(newBeginning));
    },
    toggleLoading: () => {
      dispatch(toggleLoadingAC());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsersContainer);
