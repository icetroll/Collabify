import { useEffect, useState } from "react";
import { userService } from "services";

const user = userService.userValue;
const handleCheckbox = (setValue) => (e) => setValue(e.target.checked);

function Page() {
  const [profile, setProfile] = useState([]);
  const [isManager, setIsManager] = useState();

  const getProfile = () => {
    userService.getProfile(user.user_id).then((x) => {
      setProfile(x);
      setIsManager(x.collab_manager);
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              className="rounded-circle mt-5"
              width="150px"
              src={`https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar_url}.png`}
            />
            <span className="font-weight-bold">{profile.username}</span>
            {/* <span className="text-black-50"></span> */}
            <span> </span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Profile Settings</h4>
            </div>
            <div className="row mt-2">
              <div className="col-12">
                <label className="labels">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={profile.username}
                  value=""
                  disabled
                />
              </div>
              <div className="col-12 mt-2">
                <label className="labels">Show As Collab Manager:</label>
                <input
                  type="checkbox"
                  className="ml-1"
                  // placeholder={profile.collab_manager}
                  checked={isManager}
                  onChange={handleCheckbox(setIsManager)}
                />
              </div>
              <div className="col-12 mt-2">
                <label className="labels">Twitter</label>
                <br />
                <button className="btn btn-primary">Connect Twitter</button>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="labels">Bio</label>
                <textarea
                  className="form-control"
                  placeholder="A short description about yourself"
                  value=""
                />
              </div>
            </div>
            <div className="mt-5 text-center">
              <button className="btn btn-primary profile-button" type="button">
                Save Profile
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 py-5">
            <div className="col-md-12 d-flex justify-content-between align-items-center experience">
              <b>Active Projects</b>
            </div>
            <br />
            <div className="col-md-12">
              <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action">
                  Project 1
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  Project 2
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  Project 3
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  Project 4
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  Project 5
                </a>
              </div>
            </div>
            <br />
            <div className="col-md-12 d-flex justify-content-between align-items-center experience">
              <span><b>Last Login:</b> {new Date(profile.last_login).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Page;
