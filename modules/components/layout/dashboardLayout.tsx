import Header from "./header";
import Sidebar from "./sidebar";
import classes from "./dashboardLayout.module.scss";

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className={classes.container}>
      <Sidebar />

      <div className={classes.main}>
        <Header />
        <main className={classes.content}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
