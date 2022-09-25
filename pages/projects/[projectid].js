import { useEffect } from "react";
import { userService } from "services";
import { useRouter } from "next/router";

const user = userService.userValue;

function Page() {
  const router = useRouter();
  const projectId = router.query.projectid;

  useEffect(() => {}, []);

  return (
    <div>
      <h1>Project {projectId} Page</h1>
    </div>
  );
}
export default Page;
