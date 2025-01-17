import { useContext } from 'react';

import {
  ListSubheader,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NavLink as RouterLink } from 'react-router-dom';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';

import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa6";
import { SiPivotaltracker } from "react-icons/si";
import { TbTruckDelivery } from "react-icons/tb";
import { MdManageHistory } from "react-icons/md";
import { LuMails } from "react-icons/lu";
import { FaFileInvoice } from "react-icons/fa";
import { MdOutlineHealthAndSafety } from "react-icons/md";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  background-color: #F9FAFC; // Updated background color
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: black;
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};
          color: black;

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: black;
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: black;
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.black[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.black[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &:hover {
            color: black; 

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: goldenrod; // Change the color to goldenrod on hover
            }
          }

          &.active {
            color: black; 

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: goldenrod; // Change the color to goldenrod when active
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    'transform',
    'opacity'
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);
function SidebarMenu() {
  const { t } = useTranslation();

  const { closeSidebar } = useContext(SidebarContext);
  const userRole = localStorage.getItem('role');

  // Render menu items based on user role
  const renderMenuItems = () => {
    switch (userRole) {
      case 'Plugo_Admin':
        return (
          <>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Qaaro Master Admin')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">

                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/plugo/subscription-request"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Subscription Request')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/plugo/client-admin-list"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Client List')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/plugo/depo-client-list"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Depo List')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/plugo/plugo-dashboard"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Service Provider List')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/plugo/services-courier-list"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Courier List')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>
          </>
        );
      case 'LaMi_Admin':
        return (
          <>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('dashboard')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/lami-dashboard"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Dashboard LaMi')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>


            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('ticket')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/ticket-ticket_list"
                      startIcon={<FaClipboardList />}
                    >
                      {t('ticketList')}
                    </Button>
                  </ListItem>

                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/ticket-ticket_tracker"
                      startIcon={<SiPivotaltracker />}
                    >
                      {t('ticketTracker')}
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>



            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('courier')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/courier-courier_list"
                      startIcon={<TbTruckDelivery />}
                    >
                      {t('courierList')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/courier-courier_history"
                      startIcon={<MdManageHistory />}
                    >
                      {t('courierHistory')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>

            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('miscellaneous')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/annonymous-list"
                      startIcon={<LuMails />}
                    >
                      {t('annonymousMails')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/invoice-list"
                      startIcon={<FaFileInvoice />}
                    >
                      {t('locoInvoiceList')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami/insurance-list"
                      startIcon={<MdOutlineHealthAndSafety />}
                    >
                      {t('insuaranceList')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>
          </>
        );
      case 'Client_Admin':
        return (
          <>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Client Admin')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/dashboard"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Dashboard')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/plans-subscription"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Plans & Subscription')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>


            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Listing')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/depo-list"
                      startIcon={<FaClipboardList />}
                    >
                      {t('Depo List')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/pending-invites"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Invites List')}
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>

            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Overviews')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/depo-overview"
                      startIcon={<LuMails />}
                    >
                      {t('Depo Overview')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/service-provider-overview"
                      startIcon={<FaFileInvoice />}
                    >
                      {t('SP Overview')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/client-admin/courier-overview"
                      startIcon={<MdOutlineHealthAndSafety />}
                    >
                      {t('Courier Overview')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>
          </>
        );

      case 'Depo_Admin':
        return (
          <>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Depo Admin')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/depo-admin/dashboard"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Dashboard')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/depo-admin/plans-subscription"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Plans & Subscription')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>


            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Listing')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/depo-admin/service-provider-list"
                      startIcon={<FaClipboardList />}
                    >
                      {t('Service Provider List')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/depo-admin/pending-invites"
                      startIcon={<MdOutlineDashboardCustomize />}
                    >
                      {t('Invites List')}
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>

            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('Overviews')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">

                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/depo-admin/service-provider-overview"
                      startIcon={<FaFileInvoice />}
                    >
                      {t('SP Overview')}
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/depo-admin/courier-overview"
                      startIcon={<MdOutlineHealthAndSafety />}
                    >
                      {t('Courier Overview')}
                    </Button>
                  </ListItem>

                </List>
              </SubMenuWrapper>
            </List>
          </>
        );

      case 'LaMi_Courier':
        return (
          <>
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t('dashboardLamiCourier')}
                </ListSubheader>
              }
            >
              <SubMenuWrapper>
                <List component="div">


                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami-courier/dashboard"
                      startIcon={<AccountCircleTwoToneIcon />}
                    >
                      {t('dashboard')}
                    </Button>
                  </ListItem>

                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami-courier/courier-list"
                      startIcon={<AccountCircleTwoToneIcon />}
                    >
                      {t('ticketList')}
                    </Button>
                  </ListItem>


                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={RouterLink}
                      onClick={closeSidebar}
                      to="/lami-courier/lost&offset-list"
                      startIcon={<AccountCircleTwoToneIcon />}
                    >
                      {t('Lost values & Offset ')}
                    </Button>
                  </ListItem>
                </List>
              </SubMenuWrapper>
            </List>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MenuWrapper>
        {renderMenuItems()}
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;

