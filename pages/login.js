import { useEffect } from "react";
import { userService } from "services";

const user = userService.userValue;

function Page() {
  useEffect(() => {
    
  }, []);

  return (
    <div>
      <h1>Hello World - {user.token}</h1>
    </div>
  );
}
export default Page;
