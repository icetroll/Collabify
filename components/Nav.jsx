import { useState, useEffect } from "react";

import { NavLink } from ".";
import { userService } from "services";

export { Nav };

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }

  function login() {
    userService.login();
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div class="container-fluid">
        <div className="collapse navbar-collapse">
          <div className="navbar-nav ml-4">
          <NavLink href="/" exact className="nav-item nav-link">
              Home
            </NavLink>
            <NavLink href="/projects" exact className="nav-item nav-link">
              Projects
            </NavLink>            
            <NavLink href="/managers" exact className="nav-item nav-link">
              Collab Managers
            </NavLink>
          </div>
          <div class="navbar-nav nav-right mr-4">
            {user?.user_id !== undefined ? (
              <>
                <img
                  className="profile-image"
                  src={`https://cdn.discordapp.com/avatars/${user.user_id}/${user.avatar_url}.png`}
                />
                <NavLink href="/profile" exact className="nav-item nav-link">{user.username}</NavLink>
                <a onClick={logout} className="nav-item nav-link">
                  Logout
                </a>
              </>
            ) : (
              <>
                <a onClick={login} className="nav-item nav-link">
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
