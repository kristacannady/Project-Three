//Project Title
//UserName
//Project Description
//Project Goal
//Goal Met
//Donate button

//Comments of Support

import React from 'react';
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { QUERY_CURRENT_USER } from '../graphql/queries';
// import { CurrentUserContextProvider } from '../context';

const ProjectView = (props) => {
  const { id: projectId } = useParams();
  // TODO: need to work on map through .project data and displaying it on my-projects page.
  // TODO: May need to create separate page for this

  const { loading, data } = useQuery(QUERY_CURRENT_USER);

  const user = data?.getCurrentUser || {};
  console.log(user);
  const project = data?.getCurrentUser.projects || {};
  console.log(project);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>{project[0].projectTitle}</h1>
        <p>
          <span>
            {user.firstName} {user.lastName}
          </span>
        </p>
        <div>
          <p>{project[0].projectDescription}</p>
        </div>
        <div>
          <p>${project[0].projectGoal}</p>
        </div>
        {/* {CurrentUserContextProvider.isLoggedIn && } */}
      </div>
    </div>
  );
};

export default ProjectView;
