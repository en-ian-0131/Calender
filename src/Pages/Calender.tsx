import { useEffect, useState } from "react";
import "../App.css";

const Calendar = (props: { year: number; month: number }) => {
  class ActivedClass {
    firstActive: string = "";
    lastActive: string = "";
    hasFirstActive: boolean = false;
  }

  const { year, month } = props;
  const [calender, setCalendar] = useState<string[][]>([]);
  const todayMonth = new Date().getMonth() + 1;
  const today = new Date().getDate();
  const [actived, setActived] = useState<ActivedClass>(new ActivedClass());
  const [mouseCount, setMouseCount] = useState<number>(1);

  const generate = () => {
    const firstDate = new Date(year, month - 1, 1); //9/1 周日
    const lastMonthDate = new Date(year, month - 1, 0).getDate(); //7/31 31
    const lastDate = new Date(year, month, 0); //9/30 周一
    let currentDate = 1;
    let lastMonthAndfirstweek =
      lastMonthDate - new Date(year, month - 1, 1).getDay() + 1;

    const weeks = Math.ceil((lastDate.getDate() - firstDate.getDate() + 1) / 7);

    let lastMonthlastWeek: string[] = [];
    for (let i = 0; i < weeks; i++) {
      if (lastMonthAndfirstweek <= lastMonthDate)
        lastMonthlastWeek.push(`${month - 1},${lastMonthAndfirstweek}`);
      lastMonthAndfirstweek++;
    }

    const table: string[][] = [];
    for (let i = 0; i < weeks; i++) {
      const days: string[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && firstDate.getDay() !== 0) {
          if (currentDate <= 7 - firstDate.getDay()) {
            days.push(`${month},${currentDate}`);
          }
        } else {
          if (i === 1 && j === 0 && firstDate.getDay() !== 0) {
            currentDate = currentDate - firstDate.getDay();
          }
          if (i === weeks - 1) {
            if (currentDate <= lastDate.getDate()) {
              days.push(`${month},${currentDate}`);
            } else if (lastDate.getDate() < 31) {
              days.push(`${month},${currentDate - 30}`);
            } else {
              days.push(`${month},${currentDate - 31}`);
            }
          } else {
            days.push(`${month},${currentDate}`);
          }
        }
        currentDate++;
      }
      table.push(days);
    }
    table[0] = lastMonthlastWeek.concat(table[0]);
    setCalendar(table);
  };

  const ifLastDateBiggerThanFirstDate = (val: string) => {
    if (new Date(actived.firstActive) > new Date(actived.lastActive)) {
      setActived({
        ...actived,
        firstActive: val,
        lastActive: "",
        hasFirstActive: true,
      });
      setMouseCount(1);
    }
  };

  const tdClick = (val: string) => {
    if (mouseCount > 2) {
      setActived({
        ...actived,
        firstActive: `${year},${val}`,
        lastActive: "",
        hasFirstActive: true,
      });
      setMouseCount(1);
    } else {
      if (actived.hasFirstActive) {
        setActived({
          ...actived,
          lastActive: `${year},${val}`,
        });
      } else {
        setActived({
          ...actived,
          firstActive: `${year},${val}`,
          hasFirstActive: true,
        });
      }
    }
    setMouseCount((prev) => prev + 1);
  };

  console.log("actived", actived);

  useEffect(() => {
    generate();
  }, [year, month]);

  useEffect(() => {
    ifLastDateBiggerThanFirstDate(actived.lastActive);
  }, [actived]);

  return (
    <div id="calendar">
      <div className="calendarTitle">
        <div className="iconLeft">{"<"}</div>
        <div>
          {year}年{month}月
        </div>
        <div className="iconRight">{">"}</div>
      </div>
      <table>
        <tbody>
          {calender.map((row, index) => {
            return (
              <tr key={`${row}-${index}`}>
                {row.map((val, index2) => {
                  return (
                    <td
                      key={`${val}-${index2}`}
                      id={`${val}`}
                      style={{
                        backgroundColor:
                          Number(val.slice(0, 1)) === todayMonth &&
                          Number(val.slice(2)) === today
                            ? "#ffff76"
                            : actived.hasFirstActive
                            ? new Date(`${year},${val}`).getTime() ===
                                new Date(actived.firstActive).getTime() ||
                              new Date(`${year},${val}`).getTime() ===
                                new Date(actived.lastActive).getTime() ||
                              (new Date(`${year},${val}`) >=
                                new Date(actived.firstActive) &&
                                new Date(`${year},${val}`) <=
                                  new Date(actived.lastActive))
                              ? "#006edc"
                              : ""
                            : "",
                        color:
                          Number(val.slice(0, 1)) !== todayMonth
                            ? "#cecece"
                            : "black",
                        cursor:
                          Number(val.slice(0, 1)) !== todayMonth
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onClick={
                        Number(val.slice(0, 1)) === todayMonth
                          ? () => {
                              tdClick(val);
                            }
                          : () => {}
                      }
                    >
                      {val.slice(2)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Calendar;
