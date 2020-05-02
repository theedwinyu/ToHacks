import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    width: 300,
},
  media: {
    height: 350,
    width: 300
  },
});

const MediaCard = (props) => {
  const classes = useStyles();

  return (
    <div className = {classes.root} onClick={props.action}>
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia  
          className={classes.media}
          image={props.image}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.subText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
  );
};
export default MediaCard;
