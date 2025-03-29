"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchForm } from "@/components/match-scouting-form";

type MatchData = {
  teamId: number;
  coralL1: number;
  coralL2: number;
  coralL3: number;
  coralL4: number;
  leftInAuton: boolean;
  pointsScoredInAuton: boolean;
  algaeInProcessor: number;
  algaeTakenOff: number;
  algaeInNet: number;
  humanPlayer: boolean;
  groundIntake: boolean;
  droppedCoral: number;
  droppedAlgae: number;
  penaltyPoints: number;
  yellowCards: number;
};

export function MatchSummary({
  teamId,
  matchId,
  matchData,
}: {
  teamId: number;
  matchId: number;
  matchData: MatchData;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
          className="mb-4"
        >
          Back to Summary
        </Button>
        <MatchForm teamId={teamId} matchId={matchId} />
      </div>
    );
  }

  const coralPoints =
    matchData.coralL1 * 3 +
    matchData.coralL2 * 4 +
    matchData.coralL3 * 6 +
    matchData.coralL4 * 7;

  const algaePoints = matchData.algaeInProcessor * 6 + matchData.algaeInNet * 6;

  const totalDrops = matchData.droppedCoral + matchData.droppedAlgae;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsEditing(true)}>Edit Data</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Autonomous Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Badge variant={matchData.leftInAuton ? "default" : "outline"}>
                Left Starting Zone
              </Badge>
              <Badge
                variant={matchData.pointsScoredInAuton ? "default" : "outline"}
              >
                Scored Points
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Robot Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <Badge variant={matchData.humanPlayer ? "default" : "outline"}>
                Human Player
              </Badge>
              <Badge variant={matchData.groundIntake ? "default" : "outline"}>
                Ground Intake
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Coral Scoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{matchData.coralL1}</div>
                <div className="text-sm text-muted-foreground">Level 1</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchData.coralL2}</div>
                <div className="text-sm text-muted-foreground">Level 2</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchData.coralL3}</div>
                <div className="text-sm text-muted-foreground">Level 3</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchData.coralL4}</div>
                <div className="text-sm text-muted-foreground">Level 4</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{coralPoints}</div>
                <div className="text-sm text-muted-foreground">
                  Total Coral Points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algae Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {matchData.algaeInProcessor}
                </div>
                <div className="text-sm text-muted-foreground">
                  In Processor
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {matchData.algaeTakenOff}
                </div>
                <div className="text-sm text-muted-foreground">Taken Off</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{matchData.algaeInNet}</div>
                <div className="text-sm text-muted-foreground">In Net</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{algaePoints}</div>
                <div className="text-sm text-muted-foreground">
                  Total Algae Points
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Drops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {matchData.droppedCoral}
                </div>
                <div className="text-sm text-muted-foreground">
                  Dropped Coral
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {matchData.droppedAlgae}
                </div>
                <div className="text-sm text-muted-foreground">
                  Dropped Algae
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalDrops}</div>
                <div className="text-sm text-muted-foreground">Total Drops</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Penalties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {matchData.penaltyPoints}
                </div>
                <div className="text-sm text-muted-foreground">
                  Penalty Points
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {matchData.yellowCards}
                </div>
                <div className="text-sm text-muted-foreground">
                  Yellow Cards
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
