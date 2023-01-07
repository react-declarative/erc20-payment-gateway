import { IMenuGroup } from "react-declarative";

import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheckOutlined";

export const sidemenu: IMenuGroup[] = [
    {
        label: "Todo list",
        name: '/main-page',
        icon: PlaylistAddCheckIcon,
    },
];

export default sidemenu;
