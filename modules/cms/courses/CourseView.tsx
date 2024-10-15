import { Courses } from "./Courses";
import { CourseTabs } from "./components/CourseTab";

const CourseView = () => {
  return (
    <div>
      <CourseTabs />
      <Courses />
    </div>
  );
};

export default CourseView;
