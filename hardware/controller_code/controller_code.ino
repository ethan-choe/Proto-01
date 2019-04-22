int tiltpin = 2;
int buttJpin = 7;
int buttLpin = 4;
int buttRpin = 8;

int dbnce = 0;
int tilt;
int buttJ;
int buttL;
int buttR;

int prevTime = 0;

void setup()
{
  Serial.begin(9600);
  pinMode(tiltpin, INPUT_PULLUP);
  pinMode(buttJpin, INPUT);
  pinMode(buttLpin, INPUT);
  pinMode(buttRpin, INPUT);
  prevTime = millis();
}
 
void loop()
{
  int currentTime = millis();
  int dt = prevTime - currentTime;
  prevTime = currentTime;

  if(dbnce > 0)
  {
    dbnce -= dt;
  }

  tilt = digitalRead(tiltpin);
  buttJ = digitalRead(buttJpin);
  buttL = digitalRead(buttLpin);
  buttR = digitalRead(buttRpin);
  
  // Flip
//   Serial.print(tilt);
  if(tilt == HIGH) {
    if(dbnce <= 0)
    {
      Serial.print("b~");
      dbnce = 200;
    }
    if(buttL == HIGH)
    {
      Serial.print("l~");
    }
    if(buttR == HIGH)
    {
      Serial.print("r~");
    }
  }
  else
  {
    if(dbnce <= 0)
    {
      Serial.print("t~");
      dbnce = 200;
    }
    
    if(buttL == HIGH)
    {
      Serial.print("r~");
    }
    if(buttR == HIGH)
    {
      Serial.print("l~");
    }
  }

//  // Movement
  if(buttJ == HIGH)
  {
    Serial.print("j~");  
  }
//  if(buttL == HIGH)
//  {
//    Serial.print("l~");
//  }
//  if(buttR == HIGH)
//  {
//    Serial.print("r~");
//  }
  else
  {
//    Serial.print("s~");
  }
  
  delay(10);
}
