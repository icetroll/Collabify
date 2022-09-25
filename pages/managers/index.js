import { useEffect } from "react";
import { userService } from "services";
import NextLink from 'next/link';

const user = userService.userValue;
const href = 'discord://discord.com/users/';

function Page() {
  useEffect(() => {}, []);

  return (
    <div>
      <h1>Collab Managers Page</h1>
      <NextLink href={href + user.user_id}>
            <a>
                View profile
            </a>
        </NextLink>
    </div>
  );
}
export default Page;
