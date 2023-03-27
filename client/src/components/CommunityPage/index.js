import React from 'react';
//figure out how to import projects from database
import {
  QUERY_PROJECT_CATEGORY,
  QUERY_CURRENT_USER,
} from '../../graphql/queries';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_FAVORITE } from '../../graphql/mutations';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdOutlineComment } from 'react-icons/md';


const Community = () => {
  //favorite project in category
  const [addFavorite, { error }] = useMutation(ADD_FAVORITE);

  const favoriteProject = async (projectId) => {
    try {
      await addFavorite({
        variables: {
          projectId,
        },
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  //filter projects to get all education category
  const { loading, data } = useQuery(QUERY_PROJECT_CATEGORY, {
    variables: { projectCategory: 'Community Outreach' },
  });

  //get currentUser info from DB
  const currentUserRes = useQuery(QUERY_CURRENT_USER);

  if (loading || currentUserRes.loading) {
    return <div className="no-projects-message">Loading...</div>;
  }

  const notLoggedIn = currentUserRes.data?.getCurrentUser == null;

  const userFavs = currentUserRes.data?.getCurrentUser?.favorites;

  //get current user favorite projects
  const userFavProjectsId = userFavs?.map((userFavs) => userFavs._id);
  console.log(userFavProjectsId);

  const projects = data.getProjectByCategory || [];

  const projectIds = projects.map((project) => project._id);

  const comments = projects.map((project) => project.donations[0]?.commentBody);

  const MAX_LENGTH = 60;

  if (projects.length === 0) {
    return (
      <div className="no-projects-message">
        No Projects for this category consider making one
        <Link to="/NewProject"> here!</Link>
      </div>
    );
  }

  const matchProjectIds = userFavProjectsId?.filter(idData => projectIds.includes(idData));
  console.log(matchProjectIds);

  let favIcon = null;

  return (
    <div className="row justify-content-md-center">
      {projects &&
        projects.map((project) => {

          if (notLoggedIn) {
            favIcon = null;
          }
          else if (matchProjectIds?.includes(project._id)) {
            favIcon = <FaHeart className="fav-btn" size={35} />
          }
          else {
            favIcon = <FaRegHeart className="fav-btn" size={35} />
          }

          //Truncate description length 
          let trimmedDescription = project.projectDescription;

          if (trimmedDescription.length > MAX_LENGTH) {
            trimmedDescription = project.projectDescription.slice(0, MAX_LENGTH) + '...';
          }

          const comments = project.donations.filter(donation => donation.commentBody != null);

          return (<div className="col-md-auto d-flex" key={project._id}>
            <div className="project-card card">
              <div className="new-project-form card-body">
                <div className="container">
                  <div className="row">
                    <div className="col-sm">
                      {/* Add link to ProjectsByOrg, need to take link that is clicked and prop into projectsbyorg*/}

                      <Link
                        className="org-name org-name-style hover"
                        to={`/ProjectsByOrg/${project.organizationName}`}
                      >
                        {project.organizationName}
                      </Link>
                    </div>
                    <div className="col-sm">
                      <MdOutlineComment size={35}></MdOutlineComment><span>{comments.length}</span>
                    </div>
                    <div className="col-sm" onClick={() => favoriteProject(project._id)}>
                      {favIcon}
                    </div>
                  </div>
                </div>
                <Link className="project-link" to={`/project/${project._id}`}>
                  <h3 className="card-title">{project.projectTitle}</h3>
                </Link>
                <p className="card-text">{trimmedDescription}</p>
                <p className="card-text">Goal: ${project.projectGoal}</p>
                <div className="progress">
                  <div
                    className="progress-bar bg-custom w-50"
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    50%
                  </div>
                </div>
              </div>
            </div>
          </div>)
        })}
    </div>
  );
};

export default Community;
